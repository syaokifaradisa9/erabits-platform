<?php

namespace App\Services;

use App\DataTransferObjects\WorksheetDTO;
use App\Models\ItemOrderMaintenance;
use App\Repositories\ClientInventory\ClientInventoryRepository;
use App\Repositories\ClientInventoryMaintenance\ClientInventoryMaintenanceRepository;
use App\Repositories\ItemOrder\ItemOrderRepository;
use App\Repositories\ItemOrderChecklist\ItemOrderChecklistRepository;
use App\Repositories\ItemOrderMaintenance\ItemOrderMaintenanceRepository;
use Illuminate\Support\Facades\DB;

class WorksheetService
{
    public function __construct(
        protected ItemOrderRepository $itemOrderRepository,
        protected ItemOrderMaintenanceRepository $itemOrderMaintenanceRepository,
        protected ItemOrderChecklistRepository $itemOrderChecklistRepository,
        protected ClientInventoryRepository $clientInventoryRepository,
        protected ClientInventoryMaintenanceRepository $clientInventoryMaintenanceRepository
    ) {
    }

    public function storeChecklist(WorksheetDTO $worksheetDTO, ItemOrderMaintenance $maintenance)
    {
        DB::transaction(function () use ($worksheetDTO, $maintenance) {
            // Handle image upload if provided (for maintenance proof/bukti pemeliharaan)
            $imagePath = null;
            if ($worksheetDTO->image) {
                // Delete old image file if exists
                if ($maintenance->image_path) {
                    \Storage::disk('public')->delete($maintenance->image_path);
                }
                $imagePath = $worksheetDTO->image->store('maintenance_worksheets', 'public');
            }
            
            // Handle asset image upload if provided (for asset identification/foto alat)
            $assetImagePath = null;
            if ($worksheetDTO->asset_image) {
                // Delete old asset image file if exists
                if ($maintenance->asset_image_path) {
                    \Storage::disk('public')->delete($maintenance->asset_image_path);
                }
                $assetImagePath = $worksheetDTO->asset_image->store('asset_images', 'public');
            }

            $this->itemOrderRepository->update(
                $maintenance->item_order_id,
                $worksheetDTO->toItemOrderArray()
            );

            // Update finish date dan image paths pada maintenance
            $updateData = [
                'finish_date' => $worksheetDTO->finish_date,
            ];
            
            // Handle deletion of existing images if requested
            // Check if the form sends a delete flag (this would need to come from frontend)
            if ($worksheetDTO->delete_image ?? false) {
                if ($maintenance->image_path) {
                    \Storage::disk('public')->delete($maintenance->image_path);
                    $updateData['image_path'] = null;
                }
            } elseif ($imagePath) {
                $updateData['image_path'] = $imagePath;
            }
            
            if ($worksheetDTO->delete_asset_image ?? false) {
                if ($maintenance->asset_image_path) {
                    \Storage::disk('public')->delete($maintenance->asset_image_path);
                    $updateData['asset_image_path'] = null;
                }
            } elseif ($assetImagePath) {
                $updateData['asset_image_path'] = $assetImagePath;
            }
            
            $this->itemOrderMaintenanceRepository->update($maintenance->id, $updateData);

            foreach ($worksheetDTO->checklists as $checklist) {
                // Hapus field-field tambahan sebelum menyimpan ke database
                $checklistData = collect($checklist)->except([
                    'additional_fix_action',
                    'new_repair_status', 
                    'new_repair_cost_estimate',
                    'new_repair_notes'
                ])->toArray();
                
                // Jika ada perbaikan lanjutan, update field-fixnya
                if (isset($checklist['additional_fix_action']) && !empty($checklist['additional_fix_action'])) {
                    // Gabungkan aksi perbaikan lama dan baru
                    if (isset($checklistData['fix_action']) && $checklistData['fix_action']) {
                        // Jika sudah ada aksi sebelumnya, tambahkan yang baru
                        $checklistData['fix_action'] .= '; ' . $checklist['additional_fix_action'];
                    } else {
                        $checklistData['fix_action'] = $checklist['additional_fix_action'];
                    }
                }

                $this->itemOrderChecklistRepository->updateOrCreate(
                    [
                        'item_order_maintenance_id' => $maintenance->id,
                        'item_checklist_id' => $checklist['item_checklist_id'],
                    ],
                    $checklistData
                );
            }

            // Update ClientInventory dengan informasi terbaru

            // Jika identify_number kosong atau null, kita akan mencoba identifikasi berdasarkan kombinasi informasi lain
            if (empty($worksheetDTO->identify_number)) {
                $clientInventory = $this->clientInventoryRepository->updateOrCreate(
                    [
                        'user_id' => $maintenance->itemOrder->order->client_id,
                        'name' => $maintenance->itemOrder->name,
                        'merk' => $worksheetDTO->merk,
                        'model' => $worksheetDTO->model,
                    ],
                    [
                        'service_item_type_id' => $maintenance->itemOrder->item->service_item_type_id,
                        'identify_number' => $worksheetDTO->identify_number,
                        ...$worksheetDTO->toClientInventoryArray()
                    ]
                );
            } else {
                $clientInventory = $this->clientInventoryRepository->updateOrCreate(
                    [
                        'user_id' => $maintenance->itemOrder->order->client_id,
                        'name' => $maintenance->itemOrder->name, // Include name to differentiate different items with same SN
                        'identify_number' => $worksheetDTO->identify_number,
                    ],
                    [
                        'service_item_type_id' => $maintenance->itemOrder->item->service_item_type_id,
                        'merk' => $worksheetDTO->merk,
                        'model' => $worksheetDTO->model,
                        ...$worksheetDTO->toClientInventoryArray()
                    ]
                );
            }

            // Pastikan ClientInventory diperbarui dengan informasi terbaru

            if (isset($worksheetDTO->location)) {
                $this->clientInventoryMaintenanceRepository->updateOrCreate(
                    [
                        'client_inventory_id' => $clientInventory->id,
                        'item_order_maintenance_id' => $maintenance->id,
                    ],
                    [
                        'location' => $worksheetDTO->location,
                    ]
                );
            }
            
            // Cek dan update status order jika pekerjaan dimulai
            $this->updateOrderStatusWhenWorkStarts($maintenance);
            
            // Cek apakah semua checklist dalam order telah diisi dan update status order jika perlu
            $this->updateOrderStatusIfAllChecklistsCompleted($maintenance);
        });
    }
    
    private function updateOrderStatusIfAllChecklistsCompleted(ItemOrderMaintenance $maintenance): void
    {
        $order = $maintenance->itemOrder->order;
        
        // Hanya proses jika status order saat ini adalah 'Terkonfirmasi' atau 'Dikerjakan'
        if ($order->status !== \App\Enum\OrderStatus::Confirmed && $order->status !== \App\Enum\OrderStatus::InProgress) {
            return;
        }
        
        // Dapatkan semua maintenances untuk order ini
        $maintenances = $order->maintenances;
        
        // Periksa apakah semua maintenance telah selesai (memiliki finish_date)
        // dan semua checklistnya telah diisi
        $allMaintenancesCompleted = true;
        $allChecklistsFilled = true;
        
        foreach ($maintenances as $maintenanceItem) {
            // Pastikan maintenance memiliki finish_date
            if (!$maintenanceItem->finish_date) {
                $allMaintenancesCompleted = false;
                break;
            }
            
            $checklists = $maintenanceItem->checklists;
            
            if ($checklists->count() === 0) {
                // Jika maintenance memiliki finish_date tapi tidak memiliki checklist,
                // kita asumsikan bahwa tidak perlu checklist dan anggap selesai
                continue;
            } else {
                // Jika maintenance memiliki checklist, pastikan semua checklist memiliki condition
                foreach ($checklists as $checklist) {
                    if (empty($checklist->condition)) {
                        $allChecklistsFilled = false;
                        break 2; // Keluar dari loop dalam dan luar
                    }
                }
            }
        }
        
        if ($allMaintenancesCompleted && $allChecklistsFilled) {
            // Update status order menjadi 'Selesai'
            $order->update(['status' => \App\Enum\OrderStatus::Finish]);
        }
    }
    
    private function updateOrderStatusWhenWorkStarts(ItemOrderMaintenance $maintenance): void
    {
        $order = $maintenance->itemOrder->order;

        // Hanya proses jika status order saat ini adalah 'Terkonfirmasi'
        if ($order->status !== \App\Enum\OrderStatus::Confirmed) {
            return;
        }

        // Cek apakah ada checklist yang sudah diisi (artinya pekerjaan sudah dimulai)
        $hasChecklistData = false;
        
        // Dapatkan semua maintenances untuk order ini
        $maintenances = $order->maintenances;
        
        foreach ($maintenances as $maintenanceItem) {
            $checklists = $maintenanceItem->checklists;

            foreach ($checklists as $checklist) {
                // Jika ada checklist yang memiliki data (condition, repair_status, dll), artinya pekerjaan sudah dimulai
                if (!empty($checklist->condition) || !empty($checklist->repair_status) || !empty($checklist->fix_action)) {
                    $hasChecklistData = true;
                    break 2; // Keluar dari kedua loop
                }
            }
        }

        // Jika ditemukan checklist dengan data, ubah status menjadi 'Dikerjakan'
        if ($hasChecklistData) {
            $order->update(['status' => \App\Enum\OrderStatus::InProgress]);
        }
    }

}

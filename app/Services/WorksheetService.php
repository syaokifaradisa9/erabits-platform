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
                $this->itemOrderChecklistRepository->updateOrCreate(
                    [
                        'item_order_maintenance_id' => $maintenance->id,
                        'item_checklist_id' => $checklist['item_checklist_id'],
                    ],
                    $checklist
                );
            }

            if (isset($worksheetDTO->location)) {
                $clientInventory = $this->clientInventoryRepository->updateOrCreate(
                    [
                        'user_id' => $maintenance->itemOrder->order->client_id,
                        'identify_number' => $worksheetDTO->identify_number,
                    ],
                    [
                        'service_item_type_id' => $maintenance->itemOrder->item->service_item_type_id,
                        'name' => $maintenance->itemOrder->name,
                        ...$worksheetDTO->toClientInventoryArray()
                    ]
                );

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
        });
    }
}

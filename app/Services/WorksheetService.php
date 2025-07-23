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
            $this->itemOrderRepository->update(
                $maintenance->item_order_id,
                $worksheetDTO->toItemOrderArray()
            );

            $this->itemOrderMaintenanceRepository->update($maintenance->id, [
                'finish_date' => $worksheetDTO->finish_date,
            ]);

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

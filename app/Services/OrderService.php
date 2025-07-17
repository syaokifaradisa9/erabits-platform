<?php

namespace App\Services;

use App\DataTransferObjects\OrderDTO;
use App\Repositories\Item\ItemRepository;
use App\Repositories\ItemOrder\ItemOrderRepository;
use App\Repositories\ItemOrderChecklist\ItemOrderChecklistRepository;
use App\Repositories\ItemOrderMaintenance\ItemOrderMaintenanceRepository;
use App\Repositories\Order\OrderRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class OrderService{
    public function __construct(
        protected OrderRepository $orderRepository,
        protected ItemRepository $itemRepository,
        protected ItemOrderRepository $itemOrderRepository,
        protected ItemOrderMaintenanceRepository $itemOrderMaintenanceRepository,
        protected ItemOrderChecklistRepository $itemOrderChecklistRepository
    ){}

    public function store(OrderDTO $dto, $loggedUser){
        DB::beginTransaction();
        try{
            $order = $this->orderRepository->store([
                'client_id' => $loggedUser->id,
                'reserved_user_id' => $loggedUser->id
            ]);

            foreach($dto->items as $itemData){
                $item = $this->itemRepository->find($itemData['id']);
                for($k = 0; $k < $itemData['quantity']; $k++){
                    $itemOrder = $this->itemOrderRepository->store([
                        'order_id' => $order->id,
                        'item_id' => $item->id,
                        'name' => $item->name,
                        'price' => $item->price
                    ]);

                    $maintenanceCount = $item->maintenance_count;
                    if($maintenanceCount > 0){
                        $intervalMonths = 12 / $maintenanceCount;
                        $currentDate = Carbon::now();

                        for ($j = 0; $j < $maintenanceCount; $j++) {
                            $maintenanceDate = $currentDate->copy()->addMonths($intervalMonths * ($j + 1));
                            $this->itemOrderMaintenanceRepository->store([
                                'item_order_id' => $itemOrder->id,
                                'estimation_date' => $maintenanceDate->toDateString(),
                            ]);
                        }
                    }
                }
            }

            DB::commit();
            return $order;
        }catch(Exception $e){
            DB::rollBack();
            throw $e;
        }
    }

    public function confirm($orderId, $confirmedAt){
        DB::beginTransaction();
        try{
            $order = $this->orderRepository->findById($orderId);

            if($order->confirmation_date){
                throw new Exception("Permintaan sudah pernah dikonfirmasi!", 400);
            }

            $confirmedYear = Carbon::parse($confirmedAt)->year;
            $orderNumber = str_pad($this->orderRepository->countConfirmedByYear($confirmedYear) + 1, 3, "0", STR_PAD_LEFT);

            $this->orderRepository->update($orderId, [
                'confirmation_date' => $confirmedAt,
                'number' => date("ymd") . $orderNumber
            ]);

            $itemOrders = $this->itemOrderRepository->findByOrderId($orderId, ['item.checklists', "itemOrderMaintenances"]);
            foreach($itemOrders as $itemOrder){
                foreach($itemOrder->itemOrderMaintenances as $itemOrderMaintenance){
                    $checklists = $itemOrder->item->checklists;
                    foreach($checklists as $checklist){
                        $this->itemOrderChecklistRepository->store([
                            'item_order_maintenance_id' => $itemOrderMaintenance->id,
                            'name' => $checklist->name,
                            'description' => $checklist->description,
                        ]);
                    }
                }
            }

            DB::commit();
        }catch(Exception $e){
            DB::rollBack();
            throw $e;
        }
    }

    public function delete($orderId){
        return $this->orderRepository->delete($orderId);
    }
}

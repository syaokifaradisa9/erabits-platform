<?php

namespace App\Services;

use App\DataTransferObjects\OrderDTO;
use App\Enum\UserRole;
use App\Repositories\ItemOrder\ItemOrderRepository;
use App\Repositories\ItemOrderChecklist\ItemOrderChecklistRepository;
use App\Repositories\ItemOrderMaintenance\ItemOrderMaintenanceRepository;
use App\Repositories\Order\OrderRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class OrderService{
    public function __construct(
        protected OrderRepository $repository,
        protected ItemOrderRepository $itemOrderRepository,
        protected ItemOrderMaintenanceRepository $itemOrderMaintenanceRepository,
        protected ItemOrderChecklistRepository $itemOrderChecklistRepository
    ){}

    public function store(OrderDTO $dto, $loggedUser){
        DB::beginTransaction();
        try{
            $orderData = [
                'client_id' => $dto->clientId,
                'reserved_user_id' => $loggedUser->id
            ];

            if($loggedUser->hasRole(UserRole::Client)){
                $orderData['client_id'] = $loggedUser->id;
            }

            // Store Order
            $orderId = $this->repository->store($orderData)->id;

            $currentYear = date("Y");
            foreach($dto->toItemOrderArray() as $itemOrder){
                $item = $this->itemOrderRepository->findById($itemOrder['item_id']);
                $maintenanceCount = $item['maintenance_count'];

                for($i = 0; $i < $itemOrder['quantity']; $i++){
                    $itemOrder = $this->itemOrderRepository->store([
                        'order_id' => $orderId,
                        'item_id' => $itemOrder['item_id'],
                        'name' => $item->name,
                        'price' => $item->price,
                    ]);

                    $intervalMonths = 12 / $maintenanceCount;

                    // Dapatkan tanggal saat ini
                    $currentDay = date('d'); // hari saat ini (01-31)
                    $currentMonth = date('m'); // bulan saat ini (01-12)
                    $currentYear = date('Y'); // tahun saat ini

                    for($j = 0; $j < $maintenanceCount; $j++){
                        // Hitung bulan dan tahun untuk maintenance
                        $monthsToAdd = ($j + 1) * $intervalMonths;
                        $targetMonth = $currentMonth + $monthsToAdd;

                        // Hitung tahun tambahan jika bulan > 12
                        $addYears = floor(($targetMonth - 1) / 12);
                        $targetMonth = (($targetMonth - 1) % 12) + 1;
                        $targetYear = $currentYear + $addYears;

                        // Format bulan dengan leading zero
                        $targetMonthFormatted = str_pad($targetMonth, 2, '0', STR_PAD_LEFT);

                        // Cek apakah tanggal yang sama ada di bulan target
                        $lastDayOfTargetMonth = date('t', strtotime("$targetYear-$targetMonthFormatted-01"));

                        if (intval($currentDay) > $lastDayOfTargetMonth) {
                            // Jika tanggal saat ini lebih besar dari jumlah hari di bulan target,
                            // atur ke tanggal 1 bulan berikutnya
                            if ($targetMonth == 12) {
                                $maintenanceMonth = 1;
                                $maintenanceYear = $targetYear + 1;
                            } else {
                                $maintenanceMonth = $targetMonth + 1;
                                $maintenanceYear = $targetYear;
                            }
                            $maintenanceDay = '01';
                        } else {
                            // Tanggal valid, gunakan tanggal yang sama seperti saat ini
                            $maintenanceMonth = $targetMonth;
                            $maintenanceYear = $targetYear;
                            $maintenanceDay = $currentDay;
                        }

                        // Format bulan dan hari dengan leading zero
                        $maintenanceMonthFormatted = str_pad($maintenanceMonth, 2, '0', STR_PAD_LEFT);
                        $maintenanceDayFormatted = str_pad($maintenanceDay, 2, '0', STR_PAD_LEFT);

                        $maintenanceDate = "$maintenanceYear-$maintenanceMonthFormatted-$maintenanceDayFormatted";

                        $this->itemOrderMaintenanceRepository->store([
                            'item_order_id' => $itemOrder->id,
                            'maintenance_date' => $maintenanceDate,
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

    public function confirm($orderId, $confirmedAt){
        DB::beginTransaction();
        try{
            $order = $this->repository->findById($orderId);

            if($order->confirmation_date){
                throw new Exception("Permintaan sudah pernah dikonfirmasi!", 400);
            }

            $confirmedYear = Carbon::parse($confirmedAt)->year;
            $orderNumber = str_pad($this->repository->countConfirmedByYear($confirmedYear) + 1, 3, "0", STR_PAD_LEFT);

            $this->repository->update($orderId, [
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
        return $this->repository->delete($orderId);
    }
}

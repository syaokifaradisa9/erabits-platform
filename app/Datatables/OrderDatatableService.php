<?php

namespace App\Datatables;

use App\Enum\UserRole;
use App\Models\Order;
use App\Http\Requests\Common\DatatableRequest;

class OrderDatatableService implements DatatableService
{
    private function getStartedQuery(DatatableRequest $request, $loggedUser, $additionalData)
    {
        return Order::with(['client'])
            ->addSelect([
                'total_quantity' => \App\Models\ItemOrder::selectRaw('COALESCE(SUM(quantity), 0)')
                    ->whereColumn('order_id', 'orders.id')
            ])
            ->where(function($query) use ($request, $loggedUser){
                $query->when($loggedUser->hasRole(UserRole::Manager), function($query) use ($loggedUser){
                    $query->whereHas("itemOrders.item", function($itemOrder) use ($loggedUser){
                        $itemOrder->where("service_item_type_id", $loggedUser->service_item_type_id);
                    });
                })->when($request->search, function ($query, $search) {
                    $query->where('order_number', 'like', "%$search%")
                        ->orWhere('status', 'like', "%$search%")
                        ->orWhereHas('client', function ($query) use ($search) {
                            $query->where('name', 'like', "%$search%");
                        })->orWhereHas('user', function ($query) use ($search) {
                            $query->where('name', 'like', "%$search%");
                        });
                })
                ->when($request->order_number, function ($query, $search) {
                    $query->where('order_number', 'like', "%$search%");
                })
                ->when($request->client, function ($query, $search) {
                    $query->whereHas('client', function ($query) use ($search) {
                        $query->where('name', 'like', "%$search%");
                    });
                })
                ->when($request->user, function ($query, $search) {
                    $query->whereHas('user', function ($query) use ($search) {
                        $query->where('name', 'like', "%$search%");
                    });
                })
                ->when($request->status, function ($query, $search) {
                    $query->where('status', 'like', "%$search%");
                });
            });
    }

    public function getDatatable(DatatableRequest $request, $loggedUser = null, $additionalData = [])
    {
        $limit = $request->limit ?? 10;
        $query = $this->getStartedQuery($request, $loggedUser, $additionalData);
        return $query->paginate($limit);
    }

    public function printPdf(DatatableRequest $request, $loggedUser = null, $additionalData = [])
    {
        // TODO: Implement PDF printing
    }

    public function printExcel(DatatableRequest $request, $loggedUser = null, $additionalData = [])
    {
        // TODO: Implement Excel printing
    }
}

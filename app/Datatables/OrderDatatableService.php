<?php

namespace App\Datatables;

use App\Models\Order;
use App\Http\Requests\Common\DatatableRequest;

class OrderDatatableService implements DatatableService
{
    private function getStartedQuery(DatatableRequest $request)
    {
        return Order::with(['client'])->withCount('itemOrders as item_count')
            ->where(function($query) use ($request){
                $query->when($request->search, function ($query, $search) {
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
        $query = $this->getStartedQuery($request);
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

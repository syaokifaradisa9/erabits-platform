<?php

namespace App\Datatables;

use App\Enum\UserRole;
use App\Models\ClientInventory;
use App\Http\Requests\Common\DatatableRequest;

class ClientInventoryDatatableService implements DatatableService
{
    private function getStartedQuery(DatatableRequest $request, $loggedUser)
    {
        return ClientInventory::with(['user', 'serviceItemType'])
            ->when($loggedUser->hasRole(UserRole::Client), function($query) use ($loggedUser){
                $query->where('user_id', $loggedUser->id);
            })->when($loggedUser->hasRole(UserRole::Manager), function($query) use ($loggedUser){
                $query->where('service_item_type_id', $loggedUser->service_item_type_id);
            })->when($request->search, function($query, $search){
                $query->where(function($query) use ($search){
                    $query->whereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        })->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('merk', 'like', "%{$search}%")
                        ->orWhere('model', 'like', "%{$search}%")
                        ->orWhere('identify_number', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%")
                        ->orWhereHas('serviceItemType', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });

            })->when($request->client, function($query, $search){
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })->when($request->service_item_type, function($query, $search){
                $query->whereHas('serviceItemType', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })->when($request->location, function($query, $search){
                $query->where('location', 'like', "%{$search}%");
            })->when($request->name, function($query, $search){
                $query->where('name', 'like', "%{$search}%");
            })->when($request->merk, function($query, $search){
                $query->where('merk', 'like', "%{$search}%");
            })->when($request->model, function($query, $search){
                $query->where('model', 'like', "%{$search}%");
            })->when($request->identify_number, function($query, $search){
                $query->where('identify_number', 'like', "%{$search}%");
            })->when($request->maintenance_month, function($query, $search){
                $year = explode("-", $search)[0];
                $month = explode("-", $search)[1];

                $query->whereYear('last_maintenance_date', $year)->whereMonth("last_maintenance_date", $month);
            });

        return $query;
    }

    public function getDatatable(DatatableRequest $request, $loggedUser, $additionalData = [])
    {
        $limit = $request->limit ?? 10;
        $query = $this->getStartedQuery($request, $loggedUser);
        $data = $query->paginate($limit);
        return $data;
    }

    public function printPdf(DatatableRequest $request, $loggedUser, $additionalData = [])
    {
    }

    public function printExcel(DatatableRequest $request, $loggedUser, $additionalData = [])
    {
    }
}

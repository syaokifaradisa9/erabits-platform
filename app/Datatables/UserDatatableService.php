<?php

namespace App\Datatables;

use App\Enum\UserRole;
use App\Models\User;
use App\Http\Requests\Common\DatatableRequest;

class UserDatatableService implements DatatableService
{
    private function getStartedQuery(DatatableRequest $request)
    {
        return User::with(['roles', "serviceItemType"])
            ->whereHas('roles', function ($query) {
                $query->where('name', '!=', UserRole::Superadmin)->where("name", "!=", UserRole::Client);
            })
            ->where(function($query) use ($request){
                $query->when($request->search, function ($query, $search) {
                    $query->where('name', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%")
                        ->orWhere('phone', 'like', "%$search%")
                        ->orWhere('province', 'like', "%$search%")
                        ->orWhere('city', 'like', "%$search%")
                        ->orWhereHas('roles', function ($query) use ($search) {
                            $query->where('name', 'like', "%$search%");
                        })->orWhereHas('serviceItemType', function ($query) use ($search) {
                            $query->where('name', 'like', "%$search%");
                        });
                })
                ->when($request->service_item_type, function ($query, $search) {
                    $query->whereHas('serviceItemType', function ($query) use ($search) {
                        $query->where('name', 'like', "%$search%");
                    });
                })
                ->when($request->name, function ($query, $search) {
                    $query->where('name', 'like', "%$search%");
                })
                ->when($request->email, function ($query, $search) {
                    $query->where('email', 'like', "%$search%");
                })
                ->when($request->phone, function ($query, $search) {
                    $query->where('phone', 'like', "%$search%");
                })->when($request->role, function ($query, $search) {
                    $query->whereHas('roles', function ($query) use ($search) {
                        $query->where('name', 'like', "%$search%");
                    });
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

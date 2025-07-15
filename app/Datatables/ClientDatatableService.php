<?php

namespace App\Datatables;

use App\Models\User;
use App\Http\Requests\Common\DatatableRequest;
use App\Enum\UserRole;

class ClientDatatableService implements DatatableService
{
    private function getStartedQuery(DatatableRequest $request)
    {
        return User::with('roles')
            ->whereHas('roles', function ($query) {
                $query->where('name', UserRole::Client);
            })
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%");
            })
            ->when($request->name, function ($query, $search) {
                $query->where('name', 'like', "%$search%");
            })
            ->when($request->email, function ($query, $search) {
                $query->where('email', 'like', "%$search%");
            })
            ->when($request->phone, function ($query, $search) {
                $query->where('phone', 'like', "%$search%");
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

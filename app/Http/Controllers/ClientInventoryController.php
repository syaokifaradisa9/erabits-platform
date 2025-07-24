<?php

namespace App\Http\Controllers;

use App\Datatables\ClientInventoryDatatableService;
use App\Http\Requests\Common\DatatableRequest;
use App\Models\ClientInventory;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClientInventoryController extends Controller
{
    public function __construct(protected ClientInventoryDatatableService $datatableService)
    {
    }

    public function index()
    {
        return Inertia::render('ClientInventory/Index');
    }

    public function datatable(DatatableRequest $request)
    {
        $user = Auth::user();
        return $this->datatableService->getDatatable($request, $user);
    }

    public function maintenances(ClientInventory $inventory)
    {
        $inventory->load('maintenances.itemOrderMaintenance.itemOrder', 'serviceItemType');
        return Inertia::render('ClientInventory/Maintenance', compact("inventory"));
    }
}

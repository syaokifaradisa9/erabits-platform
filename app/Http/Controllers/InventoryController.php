<?php

namespace App\Http\Controllers;

use App\Datatables\InventoryDatatableService;
use App\DataTransferObjects\InventoryDTO;
use App\Http\Requests\Common\DatatableRequest;
use App\Http\Requests\InventoryRequest;
use App\Models\Inventory;
use App\Services\InventoryService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InventoryController extends Controller
{
    private $loggedUser;
    public function __construct(
        protected InventoryService $service,
        protected InventoryDatatableService $datatableService,
    )
    {
        $this->loggedUser = Auth::user();
    }

    public function index(){
        return Inertia::render("Inventory/Index");
    }

    public function create(){
        return Inertia::render("Inventory/Create");
    }

    public function store(InventoryRequest $request){
        $inventory = $this->service->store(
            InventoryDTO::fromAppRequest($request)
        );

        return to_route("inventories.index")
            ->with("success", "Berhasil menambahkan data $inventory->name");
    }

    public function edit(Inventory $inventory){
        return Inertia::render("Inventory/Index", compact("inventory"));
    }

    public function update(InventoryRequest $request, Inventory $inventory){
        $inventory = $this->service->update(
            $inventory->id,
            InventoryDTO::fromAppRequest($request)
        );

        return to_route("inventories.index")
            ->with("success", "Berhasil mengubah data $inventory->name");
    }

    public function delete(Inventory $inventory){
        $this->service->delete($inventory->id);

        return to_route("inventories.index")
            ->with("success", "Berhasil menghapus data $inventory->name");
    }

    public function datatable(DatatableRequest $request){
        return $this->datatableService->getDatatable($request, $this->loggedUser);
    }

    public function printPdf(DatatableRequest $request){
        return $this->datatableService->printPdf($request, $this->loggedUser);
    }

    public function printExcel(DatatableRequest $request){
        return $this->datatableService->printExcel($request, $this->loggedUser);
    }
}

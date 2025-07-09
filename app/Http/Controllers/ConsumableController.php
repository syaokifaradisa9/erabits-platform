<?php

namespace App\Http\Controllers;

use App\Datatables\ConsumableDatatableService;
use App\DataTransferObjects\ConsumableDTO;
use App\Http\Requests\Common\DatatableRequest;
use App\Http\Requests\ConsumableRequest;
use App\Models\Consumable;
use App\Services\ConsumableService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConsumableController extends Controller
{
    private $loggedUser;
    public function __construct(
        protected ConsumableService $service,
        protected ConsumableDatatableService $datatableService,
    ){
        $this->loggedUser = Auth::user();
    }

    public function index(){
        return Inertia::render("Consumable/Index");
    }

    public function create(){
        return Inertia::render("Consumable/Create");
    }

    public function store(ConsumableRequest $request){
        $consumable = $this->service->store(
            ConsumableDTO::fromAppRequest($request)
        );

        return to_route("consumables.index")
            ->with("success", "Menambah data barang $consumable->name berhasil");
    }

    public function edit(Consumable $consumable){
        return Inertia::render("Consumable/Create", compact("consumable"));
    }

    public function update(ConsumableRequest $request, Consumable $consumable){
        $consumable = $this->service->update(
            $consumable->id,
            ConsumableDTO::fromAppRequest($request)
        );

        return to_route("consumables.index")
            ->with("success", "Mengubah data barang $consumable->name berhasil");
    }

    public function delete(Consumable $consumable){
        $this->service->delete($consumable->id);

        return to_route("consumables.index")
            ->with("success", "Menghapus data barang $consumable->name berhasil");
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

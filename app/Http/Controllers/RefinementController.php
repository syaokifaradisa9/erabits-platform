<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\ItemOrder;
use App\Models\ItemOrderRefinement;
use App\Services\RefinementService;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\RefinementRequest;
use App\DataTransferObjects\RefinementDTO;
use App\Datatables\ItemOrderRefinementDatatableService;
use App\Http\Requests\Common\DatatableRequest;

class RefinementController extends Controller
{
    private $loggedUser;
    public function __construct(
        protected RefinementService $service,
        protected ItemOrderRefinementDatatableService $datatableService,
    ){
        $this->loggedUser = Auth::user();
    }

    public function index(ItemOrder $itemOrder){
        return Inertia::render('Refinement/Index', [
            'itemOrder' => $itemOrder,
        ]);
    }

    public function create(ItemOrder $itemOrder){
        return Inertia::render('Refinement/Create', [
            'itemOrder' => $itemOrder,
        ]);
    }

    public function store(RefinementRequest $request, ItemOrder $itemOrder){
        $this->service->store(
            RefinementDTO::fromAppRequest($request)
        );

        return to_route("refinements.index", $itemOrder->id)
            ->with("success", "Berhasil mencatat aktivitas perbaikan alat");
    }

    public function edit(ItemOrder $itemOrder, ItemOrderRefinement $itemOrderRefinement){
        return Inertia::render('Refinement/Create', [
            'itemOrder' => $itemOrder,
            'itemOrderRefinement' => $itemOrderRefinement
        ]);
    }

    public function update(RefinementRequest $request, ItemOrder $itemOrder, ItemOrderRefinement $itemOrderRefinement){
        $this->service->update(
            $itemOrderRefinement->id,
            RefinementDTO::fromAppRequest($request)
        );

        return to_route("refinements.index", $itemOrder->id)
            ->with("success", "Berhasil mengubah data");
    }

    public function delete(ItemOrder $itemOrder, ItemOrderRefinement $itemOrderRefinement){
        $this->service->delete($itemOrderRefinement->id);

        return to_route("refinements.index", $itemOrder->id)
            ->with("success", "Berhasil menghapus data");
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

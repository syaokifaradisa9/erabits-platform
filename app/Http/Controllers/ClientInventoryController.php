<?php

namespace App\Http\Controllers;

use App\Datatables\ClientInventoryDatatableService;
use App\Http\Requests\Common\DatatableRequest;
use Inertia\Inertia;

class ClientInventoryController extends Controller
{
    public function __construct(
        protected ClientInventoryDatatableService $datatableService
    ){}

    public function index(){
        return Inertia::render("ClientInventory/Index");
    }

    public function datatable(DatatableRequest $request){
        return $this->datatableService->getDatatable($request);
    }

    public function printPdf(DatatableRequest $request){
        return $this->datatableService->printPdf($request);
    }

    public function printExcel(DatatableRequest $request){
        return $this->datatableService->printExcel($request);
    }
}

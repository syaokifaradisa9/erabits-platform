<?php

namespace App\Http\Controllers;

use App\Datatables\ClientDatatableService;
use App\Http\Requests\Common\DatatableRequest;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function __construct(protected ClientDatatableService $datatableService)
    {
    }

    public function index()
    {
        return Inertia::render('Client/Index');
    }

    public function datatable(DatatableRequest $request)
    {
        return $this->datatableService->getDatatable($request);
    }
}

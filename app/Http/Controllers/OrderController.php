<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Order;
use App\Services\OrderService;
use App\Http\Requests\OrderRequest;
use Illuminate\Support\Facades\Auth;
use App\DataTransferObjects\OrderDTO;
use App\Datatables\OrderDatatableService;
use App\Http\Requests\Common\DatatableRequest;
use App\Http\Requests\Order\OrderConfirmationRequest;

class OrderController extends Controller
{
    private $loggedUser;
    public function __construct(
        protected OrderService $service,
        protected OrderDatatableService $datatableService,
    ){
        $this->loggedUser = Auth::user();
    }

    public function index(){
        return Inertia::render("Order/Index");
    }

    public function create(){
        return Inertia::render("Order/Create");
    }

    public function store(OrderRequest $request){
        $this->service->store(
            OrderDTO::fromAppRequest($request),
            $this->loggedUser
        );

        return to_route("orders.index")->with("success", "Berhasil mengajukan order");
    }

    public function edit(Order $order){
        return Inertia::render("Order/Edit", compact("order"));
    }

    public function delete(Order $order){
        $this->service->delete($order->id);
        return to_route("orders.index")->with("success", "Berhasil menghapus data");
    }

    public function confirm(OrderConfirmationRequest $request){
        $this->service->confirm(
            $request->id,
            $this->loggedUser
        );

        return to_route("orders.index")->with("success", "Berhasil mengonfirmasi order");
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

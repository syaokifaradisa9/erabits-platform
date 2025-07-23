<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Order;
use App\Services\ItemService;
use App\Services\OrderService;
use App\Http\Requests\OrderRequest;
use App\Services\ServiceItemTypeService;
use Illuminate\Support\Facades\Auth;
use App\DataTransferObjects\OrderDTO;
use App\Datatables\OrderDatatableService;
use App\Enum\UserRole;
use App\Http\Requests\Common\DatatableRequest;
use App\Services\ClientService;

class OrderController extends Controller
{
    private $loggedUser;
    public function __construct(
        protected OrderService $orderService,
        protected ItemService $itemService,
        protected ServiceItemTypeService $serviceItemTypeService,
        protected OrderDatatableService $orderDatatableService,
        protected ClientService $clientService,
    ){
        $this->loggedUser = Auth::user();
    }

    public function index(){
        return Inertia::render("Order/Index");
    }

    public function datatable(DatatableRequest $request){
        return $this->orderDatatableService->getDatatable($request);
    }

    public function create(){
        $clients = [];
        if($this->loggedUser->hasRole([UserRole::Superadmin, UserRole::Admin, UserRole::Manager])){
            $clients = $this->clientService->getAll();
        }

        $items = $this->itemService->getAllItems();
        $serviceItemTypes = $this->serviceItemTypeService->getActiveService();
        return Inertia::render("Order/Create", compact("items", "serviceItemTypes", "clients"));
    }

    public function store(OrderRequest $request){
        $this->orderService->store(
            OrderDTO::fromAppRequest($request),
            $this->loggedUser
        );

        return to_route("orders.index")->with("success", "Berhasil mengajukan order");
    }

    public function update(OrderRequest $request, Order $order){
        $this->orderService->update(
            $order,
            OrderDTO::fromAppRequest($request)
        );

        return to_route("orders.index")->with("success", "Berhasil mengupdate order");
    }

    public function edit(Order $order){
        $clients = [];
        if($this->loggedUser->hasRole([UserRole::Superadmin, UserRole::Admin, UserRole::Manager])){
            $clients = $this->clientService->getAll();
        }

        $quantifiedItems = $this->orderService->calculateItemQuantities($order);
        $items = $this->itemService->getAllItems();
        $serviceItemTypes = $this->serviceItemTypeService->getActiveService();

        return Inertia::render("Order/Create", compact("order", "items", "serviceItemTypes", "quantifiedItems", "clients"));
    }

    public function delete(Order $order){
        $this->orderService->delete($order->id);
        return to_route("orders.index")->with("success", "Berhasil menghapus data");
    }

    public function confirm(Order $order){
        $this->orderService->confirm($order->id, now());
        return to_route("orders.index")->with("success", "Berhasil mengonfirmasi order");
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Inertia\Inertia;
use App\Services\ItemService;
use App\DataTransferObjects\ItemDTO;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Item\ItemRequest;
use App\Datatables\ItemDatatableService;
use App\Services\ServiceItemTypeService;
use App\Http\Requests\Common\DatatableRequest;

class ItemController extends Controller
{
    private $loggedUser;
    public function __construct(
        protected ItemService $service,
        protected ItemDatatableService $datatableService,
        protected ServiceItemTypeService $serviceItemTypeService
    ){
        $this->loggedUser = Auth::user();
    }

    public function index(){
        return Inertia::render("Item/Index");
    }

    public function create(){
        $itemServices = $this->serviceItemTypeService->getActiveService();
        return Inertia::render("Item/Create", compact("itemServices"));
    }

    public function store(ItemRequest $request){
        $item = $this->service->store(
            ItemDTO::fromAppRequest($request)
        );

        return to_route("items.index")->with("success", "Berhasil menambahkan data $item->name");
    }

    public function edit(Item $item){
        $itemServices = $this->serviceItemTypeService->getActiveService();
        $item->load("checklists");
        return Inertia::render("Item/Create", compact("item", "itemServices"));
    }

    public function update(ItemRequest $request, Item $item){
        $item = $this->service->update(
            $item->id,
            ItemDTO::fromAppRequest($request)
        );

        return to_route("items.index")->with("success", "Berhasil mengubah data $item->name");
    }

    public function delete(Item $item){
        $this->service->delete($item->id);
        return to_route("items.index")->with("success", "Berhasil menghapus data $item->name");
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

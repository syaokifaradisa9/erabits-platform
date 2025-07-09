<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Inertia\Inertia;
use App\Services\ItemService;
use App\Http\Requests\ItemRequest;
use Illuminate\Support\Facades\Auth;
use App\Datatables\ItemDatatableService;
use App\DataTransferObjects\ItemDTO;
use App\Http\Requests\Common\DatatableRequest;

class ItemController extends Controller
{
    private $loggedUser;
    public function __construct(
        protected ItemService $service,
        protected ItemDatatableService $datatableService,
    ){
        $this->loggedUser = Auth::user();
    }

    public function index(){
        return Inertia::render("Item/Index");
    }

    public function create(){
        return Inertia::render("Item/Create");
    }

    public function store(ItemRequest $request){
        $item = $this->service->store(
            ItemDTO::fromAppRequest($request)
        );

        return to_route("items.index")->with("success", "Berhasil menambahkan data $item->name");
    }

    public function edit(Item $item){
        return Inertia::render("Item/Create", compact("item"));
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

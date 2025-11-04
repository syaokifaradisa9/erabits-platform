<?php

namespace App\Datatables;

use App\Enum\UserRole;
use App\Models\Item;
use App\Http\Requests\Common\DatatableRequest;

class ItemDatatableService implements DatatableService{
    private function getStartedQuery(DatatableRequest $request, $loggedUser){
        $query = Item::with("serviceItemType")
            ->withCount(['checklists as checklist_count'])
            ->when($loggedUser->hasRole([UserRole::Manager, UserRole::Officer, UserRole::Finance]), function($query) use ($loggedUser){
                $query->where("service_item_type_id", $loggedUser->service_item_type_id);
            })->when($request->search, function($query, $search){
                $query->where("name", "like", "%$search%")
                      ->orWhere("price", "like", "%$search%")
                      ->orWhere("maintenance_count", "like", "%$search%")
                      ->orWhereHas("serviceItemType", function($query) use ($search) {
                          $query->where("name", "like", "%$search%");
                      });
            })->when($request->service_type, function($query, $search) {
                $query->whereHas("serviceItemType", function($query) use ($search) {
                    $query->where("name", "like", "%$search%");
                });
            })->when($request->name, function($query, $search) {
                $query->where("name", "like", "%$search%");
            })->when($request->maintenance_count, function($query, $search) {
                $query->where("maintenance_count", "like", "%$search%");
            })->when($request->price, function($query, $search) {
                $query->where("price", "like", "%$search%");
            });

        return $query;
    }

    public function getDatatable(DatatableRequest $request, $loggedUser, $additionalData = []){
        $limit = $request->limit ?? 5;

        $query = $this->getStartedQuery($request, $loggedUser);
        $records = $query->paginate($limit);

        $records->getCollection()->transform(function ($item) {
            $item->image_url = $item->image_path ? \Illuminate\Support\Facades\Storage::url($item->image_path) : 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=+';
            return $item;
        });

        return $records;
    }

    public function printPdf(DatatableRequest $request, $loggedUser, $additionalData = []){

    }

    public function printExcel(DatatableRequest $request, $loggedUser, $additionalData = []){

    }
}

?>

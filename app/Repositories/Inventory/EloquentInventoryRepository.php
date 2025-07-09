<?php

namespace App\Repositories\Inventory;

use App\Models\Inventory;

class EloquentInventoryRepository implements InventoryRepository{
    public function __construct(
        protected Inventory $model,
    ){}

    public function store($data){
        return $this->model->create($data);
    }

    public function update($id, $data){
        $this->model->where("id", $id)->update($data);
        return $this->model->find($id);
    }

    public function delete($id){
        return $this->model->where("id", $id)->delete();
    }
}

?>

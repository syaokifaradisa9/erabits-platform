<?php

namespace App\Repositories\Item;

use App\Models\Item;

class EloquentItemRepository implements ItemRepository{
    public function __construct(
        protected Item $model,
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

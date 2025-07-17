<?php

namespace App\Repositories\Item;

use App\Models\Item;

class EloquentItemRepository implements ItemRepository{
    public function __construct(
        protected Item $model,
    ){}

    public function all(){
        return $this->model->with('serviceItemType')->get();
    }

    public function find($id){
        return $this->model->with('serviceItemType')->find($id);
    }

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

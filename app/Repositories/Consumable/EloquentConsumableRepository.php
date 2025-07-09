<?php

namespace App\Repositories\Consumable;

use App\Models\Consumable;

class EloquentConsumableRepository implements ConsumableRepository{
    public function __construct(
        protected Consumable $model,
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

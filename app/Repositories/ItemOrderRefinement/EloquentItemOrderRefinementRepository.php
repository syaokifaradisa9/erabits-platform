<?php

namespace App\Repositories\ItemOrderRefinement;

use App\Models\ItemOrderRefinement;

class EloquentItemOrderRefinementRepository implements ItemOrderRefinementRepository{
    public function __construct(
        protected ItemOrderRefinement $model,
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

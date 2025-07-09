<?php

namespace App\Repositories\ItemChecklist;

use App\Models\ItemChecklist;

class EloquentItemChecklistRepository implements ItemChecklistRepository{
    public function __construct(
        protected ItemChecklist $model,
    ){}

    public function store($data){
        return $this->model->create($data);
    }

    public function deleteByItemId($id){
        return $this->model->where("item_id", $id)->delete();
    }
}

?>

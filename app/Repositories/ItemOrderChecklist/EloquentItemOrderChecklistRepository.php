<?php

namespace App\Repositories\ItemOrderChecklist;

use App\Models\ItemOrderChecklist;

class EloquentItemOrderChecklistRepository implements ItemOrderChecklistRepository{
    public function __construct(
        protected ItemOrderChecklist $model,
    ){}

    public function store($data){
        return $this->model->create($data);
    }
}

?>

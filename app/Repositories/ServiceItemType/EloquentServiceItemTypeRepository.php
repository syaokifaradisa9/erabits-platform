<?php

namespace App\Repositories\ServiceItemType;

use App\Models\ServiceItemType;

class EloquentServiceItemTypeRepository implements ServiceItemTypeRepository{
    public function __construct(
        protected ServiceItemType $model,
    ){}

    public function getActive()
    {
        return $this->model->select("id", "name", "description")->orderBy("name")->where("is_active", true)->get();
    }
}

?>

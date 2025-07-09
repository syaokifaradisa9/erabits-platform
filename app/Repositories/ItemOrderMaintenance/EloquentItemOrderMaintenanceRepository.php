<?php

namespace App\Repositories\ItemOrderMaintenance;

use App\Models\ItemOrderMaintenance;

class EloquentItemOrderMaintenanceRepository implements ItemOrderMaintenanceRepository{
    public function __construct(
        protected ItemOrderMaintenance $model,
    ){}

    public function store($data){
        return $this->model->create($data);
    }
}

?>

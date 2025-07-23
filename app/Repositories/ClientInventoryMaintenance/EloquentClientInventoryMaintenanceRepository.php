<?php

namespace App\Repositories\ClientInventoryMaintenance;

use App\Models\ClientInventoryMaintenance;

class EloquentClientInventoryMaintenanceRepository implements ClientInventoryMaintenanceRepository{
    public function __construct(
        protected ClientInventoryMaintenance $model,
    ){}

    public function updateOrCreate(array $attributes, array $values)
    {
        return $this->model->updateOrCreate($attributes, $values);
    }
}

?>

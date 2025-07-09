<?php

namespace App\Repositories\ClientInventoryMaintenance;

use App\Models\ClientInventoryMaintenance;

class EloquentClientInventoryMaintenanceRepository implements ClientInventoryMaintenanceRepository{
    public function __construct(
        protected ClientInventoryMaintenance $model,
    ){}
}

?>

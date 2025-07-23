<?php

namespace App\Repositories\ClientInventoryMaintenance;

interface ClientInventoryMaintenanceRepository{
    public function updateOrCreate(array $attributes, array $values);
}

?>

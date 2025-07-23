<?php

namespace App\Repositories\ItemOrderMaintenance;

interface ItemOrderMaintenanceRepository{
    public function store($data);
    public function update($id, $data);
}

?>

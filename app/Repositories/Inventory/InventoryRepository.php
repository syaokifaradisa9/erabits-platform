<?php

namespace App\Repositories\Inventory;

interface InventoryRepository{
    public function store($data);
    public function update($id, $data);
    public function delete($id);
}

?>

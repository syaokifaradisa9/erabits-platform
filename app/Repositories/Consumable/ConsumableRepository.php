<?php

namespace App\Repositories\Consumable;

interface ConsumableRepository{
    public function store($data);
    public function update($id, $data);
    public function delete($id);
}

?>

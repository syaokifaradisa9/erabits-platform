<?php

namespace App\Repositories\Item;

interface ItemRepository{
    public function all();
    public function find($id);
    public function store($data);
    public function update($id, $data);
    public function delete($id);
}

?>

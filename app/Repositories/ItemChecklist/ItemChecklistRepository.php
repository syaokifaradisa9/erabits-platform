<?php

namespace App\Repositories\ItemChecklist;

interface ItemChecklistRepository{
    public function store($data);
    public function update($id, $data);
    public function deleteByItemId($id);
    public function findByItemId($itemId);
    public function deleteByIds(array $ids);
}

?>

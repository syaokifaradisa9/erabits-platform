<?php

namespace App\Repositories\ItemChecklist;

interface ItemChecklistRepository{
    public function store($data);
    public function deleteByItemId($id);
}

?>

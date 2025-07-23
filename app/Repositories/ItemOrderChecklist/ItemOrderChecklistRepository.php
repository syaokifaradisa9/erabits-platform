<?php

namespace App\Repositories\ItemOrderChecklist;

interface ItemOrderChecklistRepository{
    public function store($data);
    public function updateOrCreate(array $attributes, array $values);
}

?>

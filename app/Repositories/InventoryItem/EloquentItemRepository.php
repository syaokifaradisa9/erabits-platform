<?php

namespace App\Repositories\InventoryItem;

use App\Models\InventoryItem;

class EloquentInventoryItemRepository implements InventoryItemRepository{
    public function __construct(
        protected InventoryItem $model,
    ){}
}

?>

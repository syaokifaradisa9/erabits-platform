<?php

namespace App\Repositories\ConsumableItem;

use App\Models\ConsumableItem;

class EloquentConsumableItemRepository implements ConsumableItemRepository{
    public function __construct(
        protected ConsumableItem $model,
    ){}
}

?>

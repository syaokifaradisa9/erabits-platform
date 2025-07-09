<?php

namespace App\Repositories\ClientInventory;

use App\Models\ClientInventory;

class EloquentClientInventoryRepository implements ClientInventoryRepository{
    public function __construct(
        protected ClientInventory $model
    ){}
}

?>

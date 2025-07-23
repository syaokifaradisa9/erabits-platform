<?php

namespace App\Repositories\ClientInventory;

use App\Models\ClientInventory;

class EloquentClientInventoryRepository implements ClientInventoryRepository
{
    public function __construct(
        protected ClientInventory $model
    ) {
    }

    public function updateOrCreate(array $attributes, array $values)
    {
        return $this->model->updateOrCreate($attributes, $values);
    }
}

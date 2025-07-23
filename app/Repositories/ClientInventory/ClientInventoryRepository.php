<?php

namespace App\Repositories\ClientInventory;

interface ClientInventoryRepository
{
    public function updateOrCreate(array $attributes, array $values);
}

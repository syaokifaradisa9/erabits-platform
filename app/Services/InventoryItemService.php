<?php

namespace App\Services;

use App\DataTransferObjects\InventoryItemDTO;
use App\Repositories\ConsumableItem\ConsumableItemRepository;

class ConsumableItemService{
    public function __construct(
        protected ConsumableItemRepository $repository
    ){}

    public function store(InventoryItemDTO $dto){

    }
}

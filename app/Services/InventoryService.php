<?php

namespace App\Services;

use App\DataTransferObjects\InventoryDTO;
use App\Repositories\Inventory\InventoryRepository;
use Exception;

class InventoryService{
    public function __construct(
        protected InventoryRepository $repository
    ){}

    public function store(InventoryDTO $dto){
        try{
            return $this->repository->store(
                $dto->toArray()
            );
        }catch(Exception $e){
            throw $e;
        }
    }

    public function update($inventoryId, InventoryDTO $dto){
        try{
            return $this->repository->update(
                $inventoryId,
                $dto->toArray()
            );
        }catch(Exception $e){
            throw $e;
        }
    }

    public function delete($inventoryId){
        try{
            return $this->repository->delete($inventoryId);
        }catch(Exception $e){
            throw $e;
        }
    }
}

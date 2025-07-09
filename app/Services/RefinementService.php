<?php

namespace App\Services;

use App\DataTransferObjects\RefinementDTO;
use App\Repositories\ItemOrderRefinement\ItemOrderRefinementRepository;
use Exception;

class RefinementService{
    public function __construct(
        protected ItemOrderRefinementRepository $repository
    ){}

    public function store(RefinementDTO $dto){
        try{
            return $this->repository->store($dto->toArray());
        }catch(Exception $e){
            throw $e;
        }
    }

    public function update($refinementId, RefinementDTO $dto){
        try{
            return $this->repository->update(
                $refinementId,
                $dto->toArray()
            );
        }catch(Exception $e){
            throw $e;
        }
    }

    public function delete($refinementId){
        try{
            return $this->repository->delete($refinementId);
        }catch(Exception $e){
            throw $e;
        }
    }
}

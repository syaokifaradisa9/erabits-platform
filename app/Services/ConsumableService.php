<?php

namespace App\Services;

use App\DataTransferObjects\ConsumableDTO;
use App\Repositories\Consumable\ConsumableRepository;
use App\Repositories\Consumable\ConsumableTransactionRepository;
use Exception;
use Illuminate\Support\Facades\DB;

class ConsumableService{
    public function __construct(
        protected ConsumableRepository $repository,
        protected ConsumableTransactionRepository $transactionRepository
    ){}

    public function store(ConsumableDTO $dto){
        DB::beginTransaction();
        try{
            $consumable = $this->repository->store(
                $dto->toConsumableArray()
            );

            $this->transactionRepository->store(
              $dto->toConsumableTransactionArray()
            );

            Db::commit();
            return $consumable;
        }catch(Exception $e){
            DB::rollBack();
            throw $e;
        }
    }

    public function update($consumableId, ConsumableDTO $dto){
        try{
            return $this->repository->update(
                $consumableId,
                $dto->toConsumableArray()
            );
        }catch(Exception $e){
            throw $e;
        }
    }

    public function delete($consumableId){
        try{
            return $this->repository->delete($consumableId);
        }catch(Exception $e){
            throw $e;
        }
    }
}

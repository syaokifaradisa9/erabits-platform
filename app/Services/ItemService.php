<?php

namespace App\Services;

use App\DataTransferObjects\ItemDTO;
use App\Repositories\Item\ItemRepository;
use App\Repositories\ItemChecklist\ItemChecklistRepository;
use Exception;
use Illuminate\Support\Facades\DB;

class ItemService{
    public function __construct(
        protected ItemRepository $repository,
        protected ItemChecklistRepository $itemChecklistRepository
    ){}

    public function store(ItemDTO $dto){
        DB::beginTransaction();
        try{
            $item = $this->repository->store(
                $dto->toItemArray()
            );

            foreach($dto->toChecklistsArray() as $checklist){
                $checklist['item_id'] = $item->id;
                $this->itemChecklistRepository->store($checklist);
            }

            DB::commit();
            return $item;
        }catch(Exception $e){
            DB::rollBack();
            throw $e;
        }
    }

    public function update($itemId, ItemDTO $dto){
        DB::beginTransaction();
        try{
            $item = $this->repository->update(
                $itemId,
                $dto->toItemArray()
            );

            $this->itemChecklistRepository->deleteByItemId($item->id);
            foreach($dto->toChecklistsArray() as $checklist){
                $checklist['item_id'] = $item->id;

                $this->itemChecklistRepository->store($checklist);
            }

            DB::commit();
            return $item;
        }catch(Exception $e){
            DB::rollBack();
            throw $e;
        }
    }

    public function delete($itemId){
        DB::beginTransaction();
        try{
            $this->itemChecklistRepository->deleteByItemId($itemId);
            $isSuccess = $this->repository->delete($itemId);
            DB::commit();

            return $isSuccess;
        }catch(Exception $e){
            DB::rollBack();
            throw $e;
        }
    }

    public function getAllItems(){
        return $this->repository->all();
    }
}

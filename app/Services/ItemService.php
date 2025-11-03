<?php

namespace App\Services;

use App\DataTransferObjects\ItemDTO;
use App\Repositories\Item\ItemRepository;
use App\Repositories\ItemChecklist\ItemChecklistRepository;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ItemService{
    public function __construct(
        protected ItemRepository $repository,
        protected ItemChecklistRepository $itemChecklistRepository
    ){}

    public function store(ItemDTO $dto){
        DB::beginTransaction();
        try{
            $itemData = $dto->toItemArray();

            if ($dto->image) {
                $path = $dto->image->store('items', 'public');
                $itemData['image_path'] = $path;
            }

            $item = $this->repository->store(
                $itemData
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
            $itemData = $dto->toItemArray();
            $item = $this->repository->find($itemId);

            if ($dto->image) {
                if ($item->image_path) {
                    Storage::disk('public')->delete($item->image_path);
                }
                $path = $dto->image->store('items', 'public');
                $itemData['image_path'] = $path;
            }

            $item = $this->repository->update(
                $itemId,
                $itemData
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

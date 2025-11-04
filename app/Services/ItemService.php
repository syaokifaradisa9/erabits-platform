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

            // Sync Checklists only if checklist data is present in the request
            $incomingChecklistsData = $dto->toChecklistsArray();
            if (!empty($incomingChecklistsData)) {
                $incomingChecklists = collect($incomingChecklistsData);
                $existingChecklists = $this->itemChecklistRepository->findByItemId($item->id);

                // 1. Delete checklists that are no longer in the request
                $incomingIds = $incomingChecklists->pluck('id')->filter();
                $existingIds = $existingChecklists->pluck('id');
                $idsToDelete = $existingIds->diff($incomingIds);

                if ($idsToDelete->isNotEmpty()) {
                    $this->itemChecklistRepository->deleteByIds($idsToDelete->all());
                }

                // 2. Update existing or create new checklists
                foreach ($incomingChecklists as $checklistData) {
                    $checklistData['item_id'] = $item->id;
                    if (isset($checklistData['id']) && !empty($checklistData['id'])) {
                        // Update existing checklist
                        $this->itemChecklistRepository->update($checklistData['id'], $checklistData);
                    } else {
                        // Create new checklist
                        $this->itemChecklistRepository->store($checklistData);
                    }
                }
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

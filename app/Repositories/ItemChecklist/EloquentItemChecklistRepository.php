<?php

namespace App\Repositories\ItemChecklist;

use App\Models\ItemChecklist;

class EloquentItemChecklistRepository implements ItemChecklistRepository{
    public function __construct(
        protected ItemChecklist $model,
    ){}

    public function store($data){
        return $this->model->create($data);
    }

    public function update($id, $data)
    {
        $checklist = $this->model->findOrFail($id);
        $checklist->update($data);
        return $checklist;
    }

    public function deleteByItemId($id){
        return $this->model->where("item_id", $id)->delete();
    }

    public function findByItemId($itemId)
    {
        return $this->model->where('item_id', $itemId)->get();
    }

    public function deleteByIds(array $ids)
    {
        return $this->model->whereIn('id', $ids)->delete();
    }
}

?>

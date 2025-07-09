<?php

namespace App\Repositories\Consumable;

use App\Models\ConsumableTransaction;

class EloquentConsumableTransactionRepository implements ConsumableTransactionRepository{
    public function __construct(
        protected ConsumableTransaction $model,
    ){}

    public function store($data){
        return $this->model->create($data);
    }
}

?>

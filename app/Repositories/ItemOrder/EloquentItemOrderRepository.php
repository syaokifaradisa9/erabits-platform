<?php

namespace App\Repositories\ItemOrder;

use App\Models\ItemOrder;

class EloquentItemOrderRepository implements ItemOrderRepository{
    public function __construct(
        protected ItemOrder $model,
    ){}

    public function findByOrderId($orderId){
        return $this->model->where("order_id", $orderId)->get();
    }

    public function findById($id){
        return $this->model->find($id);
    }

    public function store($data){
        return $this->model->create($data);
    }
}

?>

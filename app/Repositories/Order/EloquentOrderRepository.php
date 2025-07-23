<?php

namespace App\Repositories\Order;

use App\Models\Order;

class EloquentOrderRepository implements OrderRepository{
    public function __construct(
        protected Order $model,
    ){}

    public function countConfirmedByYear($year){
        return $this->model->whereYear("created_at", $year)->whereNotNull("confirmation_date")->count();
    }

    public function countConfirmedByMonth($year, $month){
        return $this->model->whereYear("confirmation_date", $year)->whereMonth("confirmation_date", $month)->count();
    }

    public function findById($id){
        return $this->model->find($id);
    }

    public function store($data){
        return $this->model->create($data);
    }

    public function delete($id){
        return $this->model->where("id", $id)->delete();
    }

    public function update($id, $data){
        return $this->model->where("id", $id)->update($data);
    }
}

?>

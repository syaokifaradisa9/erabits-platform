<?php

namespace App\Repositories\Order;

interface OrderRepository{
    public function findById($id);
    public function store($data);
    public function update($id, $data);
    public function delete($id);
    public function countConfirmedByYear($year);
    public function countConfirmedByMonth($year, $month);
}

?>

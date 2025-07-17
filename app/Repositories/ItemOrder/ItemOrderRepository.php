<?php

namespace App\Repositories\ItemOrder;

interface ItemOrderRepository{
    public function findByOrderId($orderId);
    public function findById($id);
    public function store($data);
    public function deleteByOrderId($orderId);
}

?>

<?php

namespace App\Repositories\ItemOrderRefinement;

interface ItemOrderRefinementRepository{
    public function store($data);
    public function update($id, $data);
    public function delete($id);
}

?>

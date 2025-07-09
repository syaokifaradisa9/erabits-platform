<?php

namespace App\Repositories\ServiceItemType;

use App\Models\ServiceItemType;

class EloquentServiceItemTypeRepository implements ServiceItemTypeRepository{
    public function __construct(
        protected ServiceItemType $model,
    ){}
}

?>

<?php

namespace App\Services;

use App\Repositories\ServiceItemType\ServiceItemTypeRepository;

class ServiceItemType{
    public function __construct(
        protected ServiceItemTypeRepository $repository
    ){}

    public function getAll(){

    }
}

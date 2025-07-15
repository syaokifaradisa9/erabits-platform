<?php

namespace App\Services;

use App\Repositories\ServiceItemType\ServiceItemTypeRepository;

class ServiceItemTypeService{
    public function __construct(
        protected ServiceItemTypeRepository $repository
    ){}

    public function getActiveService(){
        return $this->repository->getActive();
    }
}

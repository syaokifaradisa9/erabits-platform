<?php

namespace App\Services;

use App\Repositories\User\UserRepository;

class ProfileService{
    public function __construct(
        protected UserRepository $repository
    ){}

    public function updateProfile(){

    }

    public function updatePassword(){

    }
}

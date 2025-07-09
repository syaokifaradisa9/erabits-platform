<?php

namespace App\Services;

use App\DataTransferObjects\UserDTO;
use App\Repositories\User\UserRepository;
use Exception;

class UserService{
    public function __construct(
        protected UserRepository $repository
    ){}

    public function store(UserDTO $dto){
        try{
            return $this->repository->store(
                $dto->toArray()
            );
        }catch(Exception $e){
            throw $e;
        }
    }

    public function update($userId, UserDTO $dto){
        try{
            return $this->repository->update(
                $userId,
                $dto->toArray()
            );
        }catch(Exception $e){
            throw $e;
        }
    }

    public function delete($userId){
        try{
            return $this->repository->delete($userId);
        }catch(Exception $e){
            throw $e;
        }
    }
}

<?php

namespace App\Services;

use App\DataTransferObjects\UserDTO;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\DB;

class UserService
{
    public function __construct(protected UserRepository $repository)
    {
    }

    public function store(UserDTO $dto)
    {
        DB::beginTransaction();
        try {
            $user = $this->repository->store($dto->toArray());

            $user->syncRoles([$dto->role]);
            DB::commit();
            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update(int $userId, UserDTO $dto)
    {
        DB::beginTransaction();
        try {
            $user = $this->repository->update($userId, $dto->toArray());
            $user->syncRoles([$dto->role]);

            DB::commit();
            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete(int $userId)
    {
        DB::beginTransaction();
        try {
            $isSuccess = $this->repository->delete($userId);
            DB::commit();
            return $isSuccess;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}

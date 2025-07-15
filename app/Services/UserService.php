<?php

namespace App\Services;

use App\DataTransferObjects\UserDTO;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(protected UserRepository $repository)
    {
    }

    public function store(UserDTO $dto)
    {
        DB::beginTransaction();
        try {
            $userData = [
                'name' => $dto->name,
                'email' => $dto->email,
                'phone' => $dto->phone,
                'password' => Hash::make($dto->password),
            ];
            $user = $this->repository->store($userData);
            $user->assignRole($dto->role);
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
            $userData = [
                'name' => $dto->name,
                'email' => $dto->email,
                'phone' => $dto->phone,
            ];

            if ($dto->password) {
                $userData['password'] = Hash::make($dto->password);
            }

            $user = $this->repository->update($userId, $userData);
            $user->syncRoles($dto->role);
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

<?php

namespace App\Services;

use App\DataTransferObjects\UserDTO;
use App\Enum\UserRole;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ClientService
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
                'province' => $dto->province,
                'city' => $dto->city,
                'address' => $dto->address,
            ];
            $user = $this->repository->store($userData);
            $user->assignRole(UserRole::Client);
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
            $user->assignRole(UserRole::Client);

            DB::commit();
            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}

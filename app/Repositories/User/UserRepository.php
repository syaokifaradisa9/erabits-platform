<?php

namespace App\Repositories\User;

use App\Models\User;

interface UserRepository
{
    public function store(array $data): User;
    public function update(int $id, array $data): User;
    public function delete(int $id): bool;
}

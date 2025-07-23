<?php

namespace App\Repositories\User;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepository
{
    public function getAll();
    public function store(array $data): User;
    public function update(int $id, array $data): User;
    public function delete(int $id): bool;
}

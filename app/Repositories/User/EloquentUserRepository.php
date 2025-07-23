<?php

namespace App\Repositories\User;

use App\Enum\UserRole;
use App\Models\User;

class EloquentUserRepository implements UserRepository{
    public function __construct(
        protected User $model,
    ){}

    public function getAll(){
        return $this->model->role(UserRole::Client)->orderBy("name")->get();
    }

    public function store(array $data): User
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): User
    {
        $user = $this->model->findOrFail($id);
        $user->update($data);
        return $user;
    }

    public function delete(int $id): bool
    {
        $user = $this->model->findOrFail($id);
        return $user->delete();
    }
}

?>

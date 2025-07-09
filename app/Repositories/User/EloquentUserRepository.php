<?php

namespace App\Repositories\User;

use App\Models\User;

class EloquentUserRepository implements UserRepository{
    public function __construct(
        protected User $model,
    ){}

    public function store($data){
        return $this->model->create($data);
    }

    public function update($id, $data){
        $this->model->where("id", $id)->update($data);
        return $this->model->find($id);
    }

    public function delete($id){
        return $this->model->where("id", $id)->delete();
    }
}

?>

<?php

namespace App\Repositories\User;

interface UserRepository{
    public function store($data);
    public function update($id, $data);
    public function delete($id);
}

?>

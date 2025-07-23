<?php

namespace App\Services;

use App\Enum\UserRole;

class RoleService
{
    public function getSubordinate($user){
        $roles = [];
        if($user->hasRole(UserRole::Superadmin)){
            $roles = [
                UserRole::Admin,
                UserRole::Manager,
                UserRole::Officer,
                UserRole::Finance
            ];
        }else if($user->hasRole(UserRole::Admin)){
            $roles = [
                UserRole::Manager,
                UserRole::Officer,
                UserRole::Finance
            ];
        }else if($user->hasRole(UserRole::Manager)){
            $roles = [
                UserRole::Officer,
                UserRole::Finance
            ];
        }

        return $roles;
    }
}

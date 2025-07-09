<?php

namespace App\Services;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class AuthService{
    public function login($email, $password){
        try{
            if(Auth::attempt(['email' => $email, 'password' => $password])){
                return;
            }

            throw new Exception("Email atau password salah!", 401);
        }catch(Exception $e){
            throw $e;
        }
    }

    public function logout(){
        Auth::logout();
        Cache::clear();

        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
}

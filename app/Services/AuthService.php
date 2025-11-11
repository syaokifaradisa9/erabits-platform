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
    
    public function register($name, $email, $password){
        try {
            $user = \App\Models\User::create([
                'name' => $name,
                'email' => $email,
                'password' => bcrypt($password)
            ]);
            
            // Berikan role Client secara otomatis
            $user->assignRole(\App\Enum\UserRole::Client);
            
            Auth::login($user);
            
            return $user;
        } catch (Exception $e) {
            throw $e;
        }
    }
}

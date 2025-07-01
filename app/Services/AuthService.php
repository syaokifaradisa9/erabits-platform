<?php

namespace App\Services;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class AuthService{
    public function login($email, $password){
        try{
            if(Auth::attempt(['email' => $email, 'password' => $password])){
                return;
            }

            throw new Exception('Email atau Password Anda Salah!', 400);
        }catch(Exception $e){
            throw new Exception($e->getMessage());
        }
    }

    public function logout(Request $request){
        Session::flush();
        Cache::flush();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if (Auth::check()) {
            Auth::logout();
        }

        $cookies = [];
        $cookieNames = ['laravel_session', 'XSRF-TOKEN', 'remember_web'];

        foreach ($cookieNames as $cookieName) {
            if ($request->hasCookie($cookieName)) {
                $cookies[] = Cookie::forget($cookieName);
            }
        }
    }

    public function updatePassword($user, $oldPassword, $newPassword){
        try{
            if(!Hash::check($oldPassword, $user->password)){
                throw new Exception('Password Lama Anda Salah!', 400);
            }

            if($oldPassword == $newPassword){
                throw new Exception('Password Baru Tidak Boleh Sama Dengan Password Lama!', 400);
            }

            $user->password = bcrypt($newPassword);
            $user->save();
        }catch(Exception $e){
            throw new Exception($e->getMessage());
        }
    }
}

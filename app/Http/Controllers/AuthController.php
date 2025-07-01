<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function login(){
        return Inertia::render("Auth/Login");
    }

    public function verify(LoginRequest $request){

    }
}

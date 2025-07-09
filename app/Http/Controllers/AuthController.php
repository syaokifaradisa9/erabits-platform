<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $service
    ){}

    public function login(){
        return Inertia::render("Auth/Login");
    }

    public function verify(LoginRequest $request){
        try {
            $this->service->login($request->email, $request->password);
            return to_route("dashboard.index");
        } catch (\Exception $e) {
            return back()->withErrors(['email' => $e->getMessage()]);
        }
    }

    public function logout(){
        $this->service->logout();
        return to_route("auth.login");
    }
}

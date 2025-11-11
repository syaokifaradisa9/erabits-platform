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

            if ($request->wantsJson()) {
                return response()->json(['user' => auth()->user()]);
            }
            
            return to_route("dashboard.index");
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['message' => $e->getMessage()], 422);
            }
            return back()->withErrors(['email' => $e->getMessage()]);
        }
    }

    public function logout(){
        $this->service->logout();
        return to_route("auth.login");
    }
    
    public function register(){
        return Inertia::render("Auth/Register");
    }
    
    public function store(\App\Http\Requests\Auth\RegisterRequest $request){
        try {
            $user = $this->service->register($request->name, $request->email, $request->password);
            
            if ($request->wantsJson()) {
                return response()->json(['user' => $user]);
            }
            
            return to_route("dashboard.index");
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['message' => $e->getMessage()], 422);
            }
            return back()->withErrors(['email' => $e->getMessage()]);
        }
    }
}

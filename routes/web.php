<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->name("auth.")->group(function(){
    Route::get("/", "login")->name("login");
    Route::post("verify", "verify")->name("verify");
});

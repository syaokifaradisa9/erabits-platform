<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->name("auth.")->group(function(){
    Route::get("/", "login")->name("login");
    Route::post("verify", "verify")->name("verify");
});

Route::middleware("auth")->group(function(){
    Route::controller(DashboardController::class)->name("dashboard.")->prefix("dashboard")->group(function(){
        Route::get("/", "index")->name("index");
    });
});

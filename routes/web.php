<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConsumableController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::redirect("/", "/auth/login");

Route::prefix("auth")->name("auth.")->controller(AuthController::class)->group(function () {
    Route::get("login", "login")->name("login");
    Route::post("verify", "verify")->name("verify");
    Route::middleware('auth')->get("logout", "logout")->name("logout");
});

Route::middleware('auth')->group(function () {
    Route::prefix("dashboard")->name("dashboard.")->controller(DashboardController::class)->group(function () {
        Route::get("/", "index")->name("index");
    });

    Route::prefix("consumables")->name("consumables.")->controller(ConsumableController::class)->group(function () {
        Route::get("/", "index")->name("index");
        Route::get("create", "create")->name("create");
        Route::post("store", "store")->name("store");
        Route::prefix("{consumable}")->group(function(){
            Route::get("edit", "edit")->name("edit");
            Route::put("update", "update")->name("update");
            Route::delete("delete", "delete")->name("delete");
        });
    });

    Route::prefix("inventories")->name("inventories.")->controller(InventoryController::class)->group(function () {
        Route::get("/", "index")->name("index");
        Route::get("create", "create")->name("create");
        Route::post("store", "store")->name("store");
        Route::prefix("{consumable}")->group(function(){
            Route::get("edit", "edit")->name("edit");
            Route::put("update", "update")->name("update");
            Route::delete("delete", "delete")->name("delete");
        });
    });

    Route::prefix("users")->name("users.")->controller(UserController::class)->group(function () {
        Route::get("/", "index")->name("index");
        Route::get("create", "create")->name("create");
        Route::get("datatable", "datatable")->name("datatable");
        Route::post("store", "store")->name("store");
        Route::prefix("{consumable}")->group(function(){
            Route::get("edit", "edit")->name("edit");
            Route::put("update", "update")->name("update");
            Route::delete("delete", "delete")->name("delete");
        });
    });

    Route::prefix("items")->name("items.")->controller(ItemController::class)->group(function () {
        Route::get("/", "index")->name("index");
        Route::get("datatable", "datatable")->name("datatable");
        Route::get("create", "create")->name("create");
        Route::post("store", "store")->name("store");
        Route::prefix("{item}")->group(function(){
            Route::get("edit", "edit")->name("edit");
            Route::put("update", "update")->name("update");
            Route::delete("/", "delete")->name("delete");
        });
    });
});

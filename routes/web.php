<?php

use App\Http\Controllers\Api\ServiceCategoryApiController;
use App\Http\Controllers\Api\OrderApiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConsumableController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientInventoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MyAssetsController;
use App\Http\Controllers\WorksheetController;
use Illuminate\Support\Facades\Route;

Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

// API routes untuk kategori layanan
Route::prefix('api')->group(function () {
    Route::get('/service-categories/{categoryId}/items', [ServiceCategoryApiController::class, 'getItemsByCategory']);
    Route::get('/user', [OrderApiController::class, 'checkUserStatus']);
    Route::middleware('auth')->group(function () {
        Route::post('/orders', [OrderApiController::class, 'store']);
    });
    
    // Route untuk permintaan layanan tanpa login
    Route::post('/service-requests', [App\Http\Controllers\Api\ServiceRequestController::class, 'store']);
});

Route::prefix("auth")->name("auth.")->controller(AuthController::class)->group(function () {
    Route::get("login", "login")->name("login");
    Route::post("verify", "verify")->name("verify");
    Route::middleware('auth')->get("logout", "logout")->name("logout");
});

Route::middleware('auth')->group(function () {
    Route::prefix("dashboard")->name("dashboard.")->controller(DashboardController::class)->group(function () {
        Route::get("/", "index")->name("index");
    });

    Route::prefix("my-assets")->name("my-assets.")->controller(MyAssetsController::class)->group(function () {
        Route::get("/", "index")->name("index");
        Route::get("/{inventory}", "show")->name("show");
        Route::post("/{inventory}/update-repair-status", "updateRepairStatus")->name("update-repair-status");
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
        Route::prefix("{user}")->group(function(){
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

    Route::prefix("clients")->name("clients.")->controller(ClientController::class)->group(function () {
        Route::get("/", "index")->name("index");
        Route::get("datatable", "datatable")->name("datatable");
        Route::get("create", "create")->name("create");
        Route::post("store", "store")->name("store");
        Route::prefix("{client}")->group(function(){
            Route::get("edit", "edit")->name("edit");
            Route::put("update", "update")->name("update");
            Route::delete("delete", "delete")->name("delete");
        });
    });

    Route::prefix("client-inventories")->name("client-inventories.")->controller(ClientInventoryController::class)->group(function () {
        Route::get("/", "index")->name("index");
        Route::get("datatable", "datatable")->name("datatable");
        Route::get("{inventory}/maintenances", "maintenances")->name("maintenances");
    });

    Route::prefix("orders")->name("orders.")->group(function () {
        Route::controller(OrderController::class)->group(function(){
            Route::get("/", "index")->name("index");
            Route::get("datatable", "datatable")->name("datatable");
            Route::get("create", "create")->name("create");
            Route::post("store", "store")->name("store");
            Route::prefix("{order}")->group(function(){
                Route::get("edit", "edit")->name("edit");
                Route::get("detail", "detail")->name("detail");
                Route::put("update", "update")->name("update");
                Route::delete("delete", "delete")->name("delete");
                Route::put("confirm", "confirm")->name("confirm");
            });
        });

        Route::prefix("{order}/worksheet")->name("worksheet.")->controller(WorksheetController::class)->group(function () {
            Route::get("/", "index")->name("index");
            Route::get("{maintenance}", "sheet")->name("sheet");
            Route::post("{maintenance}/store", "storeSheet")->name("storeSheet");
        });
    });

    Route::prefix("repair-dashboard")->name("repair-dashboard.")->controller(\App\Http\Controllers\RepairDashboardController::class)->group(function () {
        Route::get("/", "index")->name("index");
    });
    
    Route::prefix("service-requests")->name("service-requests.")->controller(\App\Http\Controllers\ServiceRequestController::class)->group(function () {
        Route::get("/", "index")->name("index");
        Route::put("/{serviceRequest}/status", "updateStatus")->name("update-status");
    });
});

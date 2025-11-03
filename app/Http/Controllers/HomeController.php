<?php

namespace App\Http\Controllers;

use App\Models\ServiceItemType;
use App\Services\ServiceCategoryCacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    private ServiceCategoryCacheService $cacheService;

    public function __construct(ServiceCategoryCacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    public function index()
    {
        try {
            // Gunakan service untuk mengelola cache kategori layanan
            $serviceCategories = $this->cacheService->getServiceCategories();

            return Inertia::render('Home', [
                'serviceCategories' => $serviceCategories,
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('HomeController@index error: ' . $e->getMessage());
            // Jika terjadi error, kembalikan array kosong
            return Inertia::render('Home', [
                'serviceCategories' => []
            ]);
        }
    }
}
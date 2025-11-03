<?php

namespace App\Services;

use App\Models\ServiceItemType;
use Illuminate\Support\Facades\Cache;

class ServiceCategoryCacheService
{
    private const CACHE_KEY = 'home_service_categories';
    private const CACHE_TTL = 3600; // 1 jam dalam detik

    /**
     * Ambil kategori layanan dari cache atau database
     */
    public function getServiceCategories()
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return $this->buildServiceCategories();
        });
    }

    /**
     * Bangun struktur kategori layanan dari database
     */
    private function buildServiceCategories()
    {
        $serviceCategoriesQuery = ServiceItemType::where('is_active', true)
            ->select('id', 'name', 'description', 'icon')
            ->with(['items' => function($query) {
                $query->select('id', 'service_item_type_id', 'name', 'image_path', 'price', 'maintenance_count')
                      ->limit(4); // Ambil hanya 4 item pertama untuk tampilan utama
            }]);

        if ($serviceCategoriesQuery->count() > 0) {
            return $serviceCategoriesQuery->get()->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description,
                    'icon' => $category->icon ?? '⚙️',
                    'color' => 'bg-blue-500',
                    'items' => $category->items->map(function ($item) { 
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'price' => $item->price,
                            'image_path' => $item->image_path,
                            'maintenance_count' => $item->maintenance_count,
                        ];
                    })->toArray()
                ];
            })->toArray();
        } else {
            return [
                [
                    'id' => 1,
                    'name' => 'Era Alkes',
                    'description' => 'Spesialis dalam alat kesehatan untuk fasilitas kesehatan',
                    'icon' => '医疗器械',
                    'color' => 'bg-blue-500',
                    'items' => []
                ],
                [
                    'id' => 2,
                    'name' => 'Era Sapras',
                    'description' => 'Spesialis dalam sarana dan prasarana fasilitas kesehatan',
                    'icon' => '设施',
                    'color' => 'bg-green-500',
                    'items' => []
                ]
            ];
        }
    }

    /**
     * Hapus cache kategori layanan
     */
    public function clearCache()
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Dapatkan TTL cache saat ini
     */
    public function getCacheTtl()
    {
        return self::CACHE_TTL;
    }
}
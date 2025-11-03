<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceItemType;
use Illuminate\Http\Request;

class ServiceCategoryApiController extends Controller
{
    public function getItemsByCategory($categoryId)
    {
        try {
            $category = ServiceItemType::where('id', $categoryId)
                ->where('is_active', true)
                ->with(['items' => function($query) {
                    $query->select('id', 'service_item_type_id', 'name', 'image_path', 'price', 'maintenance_count');
                }])
                ->first();

            if (!$category) {
                return response()->json(['error' => 'Kategori tidak ditemukan'], 404);
            }

            $categoryData = [
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

            return response()->json($categoryData);
        } catch (\Exception $e) {
            \Log::error('ServiceCategoryApiController@getItemsByCategory error: ' . $e->getMessage());
            return response()->json(['error' => 'Terjadi kesalahan saat mengambil data'], 500);
        }
    }
}
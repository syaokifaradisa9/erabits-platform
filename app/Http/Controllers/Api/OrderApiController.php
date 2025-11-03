<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Item;
use App\Models\ItemOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Services\OrderService;
use App\DataTransferObjects\OrderDTO;

class OrderApiController extends Controller
{
    public function __construct(protected OrderService $orderService)
    {}

    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                \Log::warning('OrderApiController@store: User not authenticated');
                return response()->json(['success' => false, 'message' => 'User not authenticated'], 401);
            }

            $items = $request->input('items');
            if (empty($items)) {
                \Log::warning('OrderApiController@store: Cart is empty');
                return response()->json(['success' => false, 'message' => 'Keranjang kosong'], 400);
            }

            $dto = OrderDTO::fromApiRequest($request, $user->id);
            $order = $this->orderService->store($dto, $user);

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat',
                'order_id' => $order->id
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('OrderApiController@store error: ' . $e->getMessage(), [
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function checkUserStatus(Request $request)
    {
        try {
            \Log::info('OrderApiController@checkUserStatus - starting');
            
            $user = Auth::user();
            
            \Log::info('OrderApiController@checkUserStatus', [
                'authenticated' => $user ? true : false,
                'user_id' => $user?->id
            ]);
            
            if ($user) {
                return response()->json([
                    'authenticated' => true,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email
                    ]
                ]);
            } else {
                return response()->json([
                    'authenticated' => false
                ], 401);
            }
        } catch (\Exception $e) {
            \Log::error('OrderApiController@checkUserStatus error: ' . $e->getMessage(), [
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            
            return response()->json([
                'authenticated' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    
}
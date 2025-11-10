<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request){
        $user = Auth::user();

        // Jika user memiliki role Client, tampilkan dashboard khusus client
        if ($user && $user->hasRole('Client')) {
            // Ambil data untuk dashboard client
            $totalAssets = \App\Models\ClientInventory::where('user_id', $user->id)->count();
            
            // Hitung aset dalam pemeliharaan (ada checklist dengan repair_status in_progress, pending, atau completed)
            $assetsInMaintenance = \App\Models\ClientInventory::where('user_id', $user->id)
                ->whereHas('maintenances.itemOrderMaintenance.checklists', function ($query) {
                    $query->whereIn('repair_status', ['pending', 'in_progress']);
                })
                ->count();
                
            // Hitung order aktif (Terkonfirmasi dan Dikerjakan)
            $activeOrders = \App\Models\Order::where('client_id', $user->id)
                ->whereIn('status', [\App\Enum\OrderStatus::Confirmed, \App\Enum\OrderStatus::InProgress])
                ->count();
                
            // Hitung order selesai bulan ini
            $completedOrdersThisMonth = \App\Models\Order::where('client_id', $user->id)
                ->where('status', \App\Enum\OrderStatus::Finish)
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();
                
            // Ambil order terbaru (5 order terakhir)
            $recentOrders = \App\Models\Order::where('client_id', $user->id)
                ->with(['itemOrders'])
                ->latest()
                ->limit(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'number' => $order->number,
                        'status' => $order->status,
                        'created_at' => $order->created_at->format('d M Y'),
                        'total_items' => $order->itemOrders->count(),
                    ];
                });
                
            // Ambil aset bermasalah (dengan checklist rusak)
            $problematicAssets = \App\Models\ClientInventory::where('user_id', $user->id)
                ->whereHas('maintenances.itemOrderMaintenance.checklists', function ($query) {
                    $query->where('condition', 'Rusak');
                })
                ->limit(5)
                ->get()
                ->map(function ($asset) {
                    return [
                        'id' => $asset->id,
                        'name' => $asset->name,
                        'identify_number' => $asset->identify_number,
                        'location' => $asset->location,
                    ];
                });

            $shouldRedirectToCheckout = session()->get('after_login_checkout', false);

            // Hapus session setelah dibaca agar tidak redirect terus-menerus
            if ($shouldRedirectToCheckout) {
                session()->forget('after_login_checkout');
            }

            return Inertia::render("Dashboard/Index", [
                'shouldRedirectToCheckout' => $shouldRedirectToCheckout,
                'user' => $user,
                'stats' => [
                    'total_assets' => $totalAssets,
                    'assets_in_maintenance' => $assetsInMaintenance,
                    'active_orders' => $activeOrders,
                    'completed_orders_this_month' => $completedOrdersThisMonth,
                ],
                'recent_orders' => $recentOrders,
                'problematic_assets' => $problematicAssets,
            ]);
        }

        $shouldRedirectToCheckout = session()->get('after_login_checkout', false);

        // Hapus session setelah dibaca agar tidak redirect terus-menerus
        if ($shouldRedirectToCheckout) {
            session()->forget('after_login_checkout');
        }

        return Inertia::render("Dashboard/Index", [
            'shouldRedirectToCheckout' => $shouldRedirectToCheckout
        ]);
    }
}

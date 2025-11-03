<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request){
        $user = Auth::user();

        // Jika user memiliki role Client, redirect ke my assets
        if ($user && $user->hasRole('Client')) {
            return redirect()->route('my-assets.index');
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

<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $successMessage = $request->session()->pull('success');
        $errorMessage = $request->session()->pull('error');
        $loggedUser = Auth::user();
        $roles = [];
        if($loggedUser) {
            $roles = $loggedUser->getRoleNames();
        }

        return [
            ...parent::share($request),
            ...[
                'csrf_token' => $request->session()->token(),
                'loggeduser' => $loggedUser,
                'loggedrole' => $roles,
                'flash' => [
                    'message' => $successMessage ?? $errorMessage ?? null,
                    'type' => $successMessage ? 'success' : ($errorMessage ? 'error' : null),
                ]
            ]
        ];
    }
}

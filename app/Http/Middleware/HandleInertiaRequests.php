<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
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

        return [
            ...parent::share($request),
            ...[
                'flash' => [
                    'message' => $successMessage ?? $errorMessage ?? null,
                    'type' => $successMessage ? 'success' : ($errorMessage ? 'error' : null),
                ]
            ]
        ];
    }
}

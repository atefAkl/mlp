<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCanManageSubscribers
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Unauthorized action.');
        }

        $isAuthorized = $user->can('manage_settings')
            || $user->can('manage_roles')
            || $user->hasRole('مدير التطبيق');

        if (!$isAuthorized) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}

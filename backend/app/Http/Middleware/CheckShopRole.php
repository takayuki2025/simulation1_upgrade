<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Shop;

class CheckShopRole
{
    public function handle($request, Closure $next, $role)
    {
        $shop = app('currentShop');
        $user = $request->user();

        if (!RoleService::hasRole($user, $role, $shop)) {
            return response()->json(['error' => 'Permission denied'], 403);
        }

        return $next($request);
    }
}

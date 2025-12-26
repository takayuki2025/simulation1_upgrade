<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class CheckShopRole
{
    /**
     * 例: 'shop.role:owner,manager,staff'
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        $shop = app()->has('currentShop') ? app('currentShop') : null;
        $user = $request->user();

        if (!$shop || !$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $roleList = array_values(array_filter(array_map('trim', explode(',', $roles))));
        if (count($roleList) === 0) {
            return response()->json(['error' => 'Role config invalid'], 500);
        }

        $shopId = method_exists($shop, 'id') ? $shop->id() : ($shop->id ?? null);

        foreach ($roleList as $role) {
            if ($user->hasRole($role, $shopId)) {
                return $next($request);
            }
        }

        return response()->json(['error' => 'Permission denied'], 403);
    }
}

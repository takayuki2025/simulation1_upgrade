<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ShopScopedRoleMiddleware
{
    /**
     * 使用例：
     *  Route::middleware(['auth.jwt', 'shop.role:shop_owner'])->get('/shops/{shop}/dashboard', ...);
     *
     * tenant_id は JwtAuthenticate で JWT の shop_id / tenant claim からセットされている前提。
     */
    public function handle(Request $request, Closure $next, string $roleSlug): JsonResponse|\Symfony\Component\HttpFoundation\Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        $tenantId = $request->attributes->get('tenant_id');

        if (! $tenantId) {
            return response()->json([
                'message' => 'Tenant (shop) scope is not set',
            ], 403);
        }

        if (! $user->hasRole($roleSlug, $tenantId)) {
            return response()->json([
                'message' => 'Forbidden: role ' . $roleSlug . ' for tenant ' . $tenantId . ' is required',
            ], 403);
        }

        return $next($request);
    }
}

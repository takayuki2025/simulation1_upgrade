<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Modules\Shop\Domain\Policy\ShopRolePolicy;

final class EnsureShopRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();
        $shop = app('currentShop');

        if (!$user || !$shop) {
            abort(401);
        }

        if (!ShopRolePolicy::hasAnyRole($user, $shop, $roles)) {
            abort(403, 'Shop permission denied');
        }

        return $next($request);
    }
}

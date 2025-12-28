<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Modules\Shop\Domain\Policy\ShopRolePolicy;
use App\Modules\Shop\Domain\Entity\Shop;

final class EnsureShopRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        /** @var Shop|null $shop */
        $shop = $request->attributes->get('currentShop');

        if (!$user || !$shop) {
            abort(401);
        }

        if (!ShopRolePolicy::hasAnyRole($user, $shop, $roles)) {
            abort(403, 'Shop permission denied');
        }

        return $next($request);
    }
}

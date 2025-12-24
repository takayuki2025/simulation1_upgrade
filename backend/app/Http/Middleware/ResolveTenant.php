<?php

namespace App\Http\Middleware;

use Closure;
use App\Modules\Shop\Domain\Repository\ShopRepository;

final class ResolveTenant
{
    public function handle($request, Closure $next)
    {
        $shopCode = $request->route('shop_code');

        if (!$shopCode) {
            abort(400, 'shop_code is required');
        }

        $shop = app(ShopRepository::class)->findByCode($shopCode);

        if (!$shop) {
            abort(404, 'Shop not found');
        }

        // 🔴 Request スコープに現在の Shop を確定
        app()->instance('currentShop', $shop);

        return $next($request);
    }
}

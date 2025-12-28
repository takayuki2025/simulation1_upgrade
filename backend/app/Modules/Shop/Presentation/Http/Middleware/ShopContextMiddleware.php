<?php

namespace App\Modules\Shop\Presentation\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Modules\Shop\Domain\Repository\ShopRepository;

final class ShopContextMiddleware
{
    public function __construct(
        private ShopRepository $shops
    ) {
    }

    public function handle(Request $request, Closure $next)
    {
        $shopCode = $request->route('shop_code');

        if (!$shopCode) {
            abort(404, 'shop_code not found in route');
        }

        $shop = $this->shops->findByShopCode($shopCode);

        if (!$shop || !$shop->isActive()) {
            abort(403, 'Shop not found or inactive');
        }

        // ★ Request Attribute にセット（ここが重要）
        $request->attributes->set('currentShop', $shop);

        return $next($request);
    }
}

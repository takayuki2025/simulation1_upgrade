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

        // ✅ currentShop
        $request->attributes->set('currentShop', $shop);

        // ✅ tenant_id をここで確定（超重要）
        $request->attributes->set('tenant_id', $shop->id());

        return $next($request);
    }
}

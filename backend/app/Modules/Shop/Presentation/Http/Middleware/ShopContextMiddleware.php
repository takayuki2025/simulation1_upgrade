<?php

namespace App\Modules\Shop\Presentation\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Modules\Shop\Domain\Repository\ShopRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class ShopContextMiddleware
{
    public function __construct(
        private ShopRepository $shops
    ) {
    }

    public function handle(Request $request, Closure $next)
    {
        $shopCode = $request->route('shop_code');

        if (!$shopCode || !is_string($shopCode)) {
            throw new NotFoundHttpException('shop_code not found in route');
        }

        $shop = $this->shops->findByShopCode($shopCode);

        if (!$shop) {
            throw new NotFoundHttpException('Shop not found');
        }

        if (!$shop->isActive()) {
            throw new AccessDeniedHttpException('Shop is inactive');
        }

        /**
         * ✅ 正解：Request に ShopContext を注入
         */
        $request->attributes->set('currentShop', $shop);

        return $next($request);
    }
}

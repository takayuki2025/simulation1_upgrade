<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Modules\Shop\Domain\Repository\ShopRepository;
use App\Modules\Shop\Domain\Entity\Shop;

final class SetCurrentShop
{
    public function handle(Request $request, Closure $next)
    {
        $shopCode = $request->route('shop_code');

        \Log::info('[SetCurrentShop] shop_code received', [
            'shop_code' => $shopCode,
        ]);

        if (!$shopCode) {
            abort(400, 'shop_code is required');
        }

        /** @var ShopRepository $shops */
        $shops = app(ShopRepository::class);

        $shop = $shops->findByCode($shopCode);

        if (!$shop) {
            \Log::warning('[SetCurrentShop] shop not found', [
                'shop_code' => $shopCode,
            ]);
            abort(404, 'Shop not found');
        }

        // 🔴 Request Scope に Domain Entity を固定
        app()->instance('currentShop', $shop);

        \Log::info('[SetCurrentShop] currentShop resolved', [
            'shop_id'   => $shop->id(),
            'shop_code' => $shop->code(),
        ]);

        return $next($request);
    }
}

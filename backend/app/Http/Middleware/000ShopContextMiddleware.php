<?php

namespace App\Modules\Shop\Presentation\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Modules\Shop\Domain\Repository\ShopRepository;

final class ShopContextMiddleware
{
    public function __construct(
        private ShopRepository $shops,
    ) {
    }

    public function handle(Request $request, Closure $next): Response
    {
        /**
         * shop_code は URL から取得
         * 例: /api/shops/{shop_code}/orders/...
         */
        $shopCode = $request->route('shop_code');

        if (!$shopCode || !is_string($shopCode)) {
            return response()->json(['message' => 'shop_code missing'], 400);
        }

        /**
         * Domain Entity として Shop を取得
         */
        $shop = $this->shops->findByCode($shopCode);

        if (!$shop) {
            return response()->json(['message' => 'Shop not found'], 404);
        }

        /**
         * 停止中ショップは弾く（将来拡張ポイント）
         */
        if (!$shop->isActive()) {
            return response()->json(['message' => 'Shop is suspended'], 403);
        }

        /**
         * currentShop としてコンテナに登録
         * Controller / UseCase から app('currentShop') で取得可能
         */
        app()->instance('currentShop', $shop);

        return $next($request);
    }
}

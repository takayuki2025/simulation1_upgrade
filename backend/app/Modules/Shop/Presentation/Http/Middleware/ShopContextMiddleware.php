<?php

namespace App\Modules\Shop\Presentation\Http\Middleware;

use App\Modules\Shop\Application\Dto\ShopContext;
use App\Modules\Shop\Domain\Repository\ShopQueryRepository;
use App\Modules\Shop\Domain\Repository\ShopRoleQueryRepository;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class ShopContextMiddleware
{
    public function __construct(
        private ShopQueryRepository $shops,
        private ShopRoleQueryRepository $shopRoles,
    ) {
    }

    public function handle(Request $request, Closure $next)
    {
        $shopCode = $request->route('shop_code');

        \Log::info('[🔥ShopContextMiddleware] called', [
            'shop_code' => $shopCode,
        ]);

        if (!$shopCode) {
            abort(500, 'shop_code missing');
        }

        $shop = $this->shops->findByCode($shopCode);

        if (!$shop) {
            abort(404, 'Shop not found');
        }

        // 未ログインでも閲覧可能
        $userId = Auth::id();
        $roles = [];

        if (is_int($userId)) {
            $roles = $this->shopRoles->getRoleSlugsForUserInShop(
                $userId,
                $shop->id()
            );
        }

        $context = new ShopContext(
            shopId: $shop->id(),
            shopCode: $shop->shopCode(),
            shopStatus: $shop->status(),
            ownerUserId: $shop->ownerUserId(),
            roles: $roles,
        );

        // ★ Request-scoped Context 注入（唯一の正解）
        $request->attributes->set(ShopContext::class, $context);

        return $next($request);
    }
}

<?php

namespace App\Modules\Shop\Presentation\Http\Middleware;

use App\Modules\Shop\Application\Dto\ShopContext;
use App\Modules\Shop\Domain\Policy\ShopRolePolicy;
use App\Modules\Shop\Domain\Repository\ShopRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Closure;

final class ShopContextMiddleware
{
    public function __construct(
        private ShopRepository $shops,
        private ShopRolePolicy $policy,
    ) {
    }

    public function handle(Request $request, Closure $next): Response
    {
        // ルートパラメータ名：shops/{shop_code}/...
        $shopCode = (string) $request->route('shop_code');

        if ($shopCode === '') {
            abort(404);
        }

        // Auth（差し替え前提）
        $userId = Auth::id();
        if (!is_int($userId)) {
            abort(401);
        }

        $shop = $this->shops->findByCode($shopCode);
        if (!$shop) {
            abort(404);
        }

        if (!$shop->isActive()) {
            abort(404);
        }

        if (!$this->policy->canAccessShop($userId, $shop->id())) {
            abort(403);
        }

        $roles = $this->policy->rolesFor($userId, $shop->id());

        $ctx = new ShopContext(
            shopId: $shop->id(),
            shopCode: $shop->code()->value, // ShopCode VO を想定
            shopStatus: $shop->status(),
            ownerUserId: $shop->ownerUserId(),
            roles: $roles,
        );

        // Request scope に注入（UseCase 側は DI で受け取れる）
        app()->instance(ShopContext::class, $ctx);

        return $next($request);
    }
}

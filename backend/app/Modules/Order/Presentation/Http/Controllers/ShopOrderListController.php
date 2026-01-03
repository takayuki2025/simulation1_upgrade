<?php

namespace App\Modules\Order\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Order\Application\UseCase\GetShopOrdersUseCase;
use App\Modules\Shop\Application\Dto\ShopContext;

final class ShopOrderListController extends Controller
{
    public function __invoke(
        GetShopOrdersUseCase $useCase
    ) {
        /** @var ShopContext $ctx */

        $ctx = $request->attributes->get(ShopContext::class);


        $orders = $useCase->handle(
            shopId: $ctx->shopId
        );

        return response()->json([
            'orders' => array_map(
                static fn ($dto) => $dto->toArray(),
                $orders
            ),
        ]);
    }
}

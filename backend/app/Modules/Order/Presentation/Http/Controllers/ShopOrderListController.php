<?php

namespace App\Modules\Order\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Order\Application\UseCase\GetShopOrdersUseCase;
use Illuminate\Http\Request;
use App\Modules\Shop\Domain\Entity\Shop;

final class ShopOrderListController extends Controller
{
    public function __invoke(
        Request $request,
        GetShopOrdersUseCase $useCase
    ) {
        /** @var Shop|null $shop */
        $shop = $request->attributes->get('currentShop');

        if (!$shop) {
            abort(500, 'ShopContext not resolved');
        }

        $orders = $useCase->handle($shop->id());

        return response()->json([
            'orders' => array_map(
                static fn ($dto) => $dto->toArray(),
                $orders
            ),
        ]);
    }
}

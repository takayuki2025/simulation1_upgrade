<?php

namespace App\Modules\Order\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Order\Application\UseCase\GetShopOrdersUseCase;
use Illuminate\Http\Request;

final class ShopOrderListController extends Controller
{
    public function __invoke(
        Request $request,
        GetShopOrdersUseCase $useCase
    ) {
        $shop = app('currentShop'); // ResolveTenant で確定済

        $orders = $useCase->handle($shop->id());

        return response()->json([
            'orders' => array_map(
                fn ($dto) => $dto->toArray(),
                $orders
            ),
        ]);
    }
}

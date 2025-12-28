<?php

namespace App\Modules\Shipment\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shipment\Application\UseCase\GetShopShipmentListUseCase;
use Illuminate\Http\Request;
use App\Modules\Shop\Domain\Entity\Shop;

final class ShopShipmentListController extends Controller
{
    public function __invoke(
        Request $request,
        GetShopShipmentListUseCase $useCase
    ) {
        /** @var Shop|null $shop */
        $shop = $request->attributes->get('currentShop');

        if (!$shop) {
            abort(500, 'ShopContext not resolved');
        }

        $output = $useCase->handle($shop);

        return response()->json(
            $output->toArray()
        );
    }
}

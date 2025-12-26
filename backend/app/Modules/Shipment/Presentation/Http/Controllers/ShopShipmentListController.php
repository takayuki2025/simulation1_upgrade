<?php

namespace App\Modules\Shipment\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shipment\Application\UseCase\GetShopShipmentListUseCase;
use App\Modules\Shop\Domain\Entity\Shop;

final class ShopShipmentListController extends Controller
{
    public function __invoke(GetShopShipmentListUseCase $useCase)
    {
        /** @var Shop $shop */
        $shop = app('currentShop');
        if (!$shop) {
            abort(500, 'Shop context not resolved');
        }

        $output = $useCase->handle($shop);

        return response()->json($output->toArray());
    }
}

<?php

namespace App\Modules\Shipment\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shipment\Application\UseCase\GetShopShipmentListUseCase;
use App\Modules\Shop\Application\Dto\ShopContext;

final class ShopShipmentListController extends Controller
{
    public function __invoke(
        GetShopShipmentListUseCase $useCase
    ) {
        /** @var ShopContext $ctx */

        $ctx = $request->attributes->get(ShopContext::class);


        $output = $useCase->handle(
            shopId: $ctx->shopId
        );

        return response()->json(
            $output->toArray()
        );
    }
}

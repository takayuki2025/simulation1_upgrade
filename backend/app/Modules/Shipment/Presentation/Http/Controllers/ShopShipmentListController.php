<?php

namespace App\Modules\Shipment\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shipment\Application\UseCase\GetShopShipmentListUseCase;
use App\Modules\Shop\Application\Dto\ShopContext;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

final class ShopShipmentListController extends Controller
{
    public function __invoke(
        Request $request,
        GetShopShipmentListUseCase $useCase
    ): JsonResponse {
        /** @var ShopContext|null $ctx */
        $ctx = $request->attributes->get(ShopContext::class);

        if (!$ctx) {
            abort(500, 'ShopContext is missing');
        }

        $output = $useCase->handle(
            shopId: $ctx->shopId
        );

        return response()->json(
            $output->toArray()
        );
    }
}

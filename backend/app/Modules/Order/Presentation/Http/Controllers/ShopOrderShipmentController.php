<?php

namespace App\Modules\Order\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Modules\Order\Application\UseCase\GetShopOrderShipmentUseCase;
use App\Modules\Shop\Application\Dto\ShopContext;
use App\Modules\Shipment\Application\Factory\ShopOrderShipmentViewFactory;
use App\Modules\Shipment\Domain\Repository\ShipmentQueryRepository;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Shipment\Presentation\Dto\ShopOrderShipmentView;

final class ShopOrderShipmentController extends Controller
{
    public function __construct(
        private GetShopOrderShipmentUseCase $useCase,
    ) {}

    public function __invoke(Request $request, string $shop_code, string $orderId)
    {
        /** @var ShopContext|null $ctx */
        $ctx = $request->attributes->get(ShopContext::class);
        if (! $ctx) abort(500);

        return response()->json(
            $this->useCase->handle(
                shopId: $ctx->shopId,
                orderId: (int) $orderId
            )->toArray()
        );
    }
}
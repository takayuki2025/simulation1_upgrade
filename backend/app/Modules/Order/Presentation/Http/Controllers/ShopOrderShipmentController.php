<?php

namespace App\Modules\Order\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use App\Modules\Order\Application\Query\ShopOrderShipmentQuery;

final class ShopOrderShipmentController
{
    public function __construct(
        private ShopOrderShipmentQuery $query
    ) {
    }

    public function __invoke(Request $request, string $orderId)
    {
        $orderId = (int) $orderId;

        /** @var \App\Modules\Shop\Domain\Entity\Shop $shop */
        $shop = app('currentShop');

        $shipment = $this->query->handle(
            $shop->id(),
            $orderId
        );

        if (!$shipment) {
            return response()->json(null, 404);
        }

        return response()->json($shipment);
    }
}

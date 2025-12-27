<?php

namespace App\Modules\Order\Presentation\Http\Controllers;

use App\Modules\Order\Application\Query\ShopOrderShipmentQuery;
use App\Modules\Shop\Domain\ValueObject\ShopCode;

final class ShopOrderShipmentController
{
    public function __construct(
        private ShopOrderShipmentQuery $query
    ) {
    }

    public function __invoke(string $shop_code, int $orderId)
    {
        $shipment = $this->query->findByShopAndOrder(
            new ShopCode($shop_code),
            $orderId
        );

        if (!$shipment) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($shipment);
    }
}

<?php

namespace App\Modules\Order\Presentation\Http\Controllers;

use App\Modules\Order\Application\Query\ShopOrderShipmentQuery;
use Illuminate\Http\JsonResponse;

final class ShopOrderShipmentController
{
    public function __construct(
        private ShopOrderShipmentQuery $query
    ) {
    }

    /**
     * GET /api/shops/{shop_code}/orders/{orderId}/shipment
     */
    public function __invoke(string $shop_code, int $orderId): JsonResponse
    {
        $shipment = $this->query->findByShopAndOrder(
            $shop_code,
            $orderId
        );

        if (!$shipment) {
            return response()->json(
                ['message' => 'Not found'],
                404
            );
        }

        return response()->json($shipment);
    }
}

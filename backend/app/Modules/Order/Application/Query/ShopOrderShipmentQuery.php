<?php

namespace App\Modules\Order\Application\Query;

use App\Modules\Shipment\Domain\Repository\ShipmentRepository;

final class ShopOrderShipmentQuery
{
    public function __construct(
        private ShipmentRepository $shipments
    ) {
    }

    /**
     * 店舗視点：注文に紐づく Shipment 取得
     */
    public function findByShopAndOrder(string $shopCode, int $orderId): ?array
    {
        return $this->shipments->findByShopAndOrder(
            $shopCode,
            $orderId
        );
    }
}

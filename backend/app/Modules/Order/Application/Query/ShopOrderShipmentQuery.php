<?php

namespace App\Modules\Order\Application\Query;

use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shop\Domain\ValueObject\ShopCode;

final class ShopOrderShipmentQuery
{
    public function __construct(
        private ShipmentRepository $shipments,
    ) {
    }

    public function findByShopAndOrder(ShopCode $shopCode, int $orderId): ?array
    {
        return $this->shipments->findByShopAndOrder($shopCode, $orderId);
    }
}

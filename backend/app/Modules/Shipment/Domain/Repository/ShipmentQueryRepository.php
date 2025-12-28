<?php

namespace App\Modules\Shipment\Domain\Repository;

interface ShipmentQueryRepository
{
    public function findByShopIdAndOrderId(
        int $shopId,
        int $orderId
    ): ?array;

    public function findByShopId(int $shopId): array;
}

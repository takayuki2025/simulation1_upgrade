<?php

namespace App\Modules\Shipment\Application\Dto;

final class CreateShipmentInput
{
    public function __construct(
        public int $shopId,
        public int $orderId,
    ) {
    }
}

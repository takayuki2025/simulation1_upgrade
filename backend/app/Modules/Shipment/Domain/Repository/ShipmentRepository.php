<?php

namespace App\Modules\Shipment\Domain\Repository;

use App\Modules\Shipment\Domain\Entity\Shipment;


interface ShipmentRepository
{
    public function save(Shipment $shipment): void;
    public function findByOrderId(int $orderId): ?Shipment;
}

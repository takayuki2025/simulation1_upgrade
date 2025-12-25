<?php

namespace App\Modules\Shipment\Domain\Repository;

use App\Modules\Shipment\Domain\Event\ShipmentEvent;

interface ShipmentEventRepository
{
    public function record(ShipmentEvent $event): void;
}

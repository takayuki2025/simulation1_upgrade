<?php


namespace App\Modules\Shipment\Domain\Event;

use Carbon\Carbon;

final class ShipmentEvent
{
    public function __construct(
        public int $shipmentId,
        public string $type,
        public array $payload,
        public Carbon $occurredAt,
    ) {
    }
}

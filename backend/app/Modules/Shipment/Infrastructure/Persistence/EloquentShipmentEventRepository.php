<?php

namespace App\Modules\Shipment\Infrastructure\Persistence\Repository;

use App\Models\ShipmentEvent as ShipmentEventModel;
use App\Modules\Shipment\Domain\Event\ShipmentEvent;
use App\Modules\Shipment\Domain\Event\ShipmentEventType;
use App\Modules\Shipment\Domain\Repository\ShipmentEventRepository;

final class EloquentShipmentEventRepository implements ShipmentEventRepository
{
    public function record(ShipmentEvent $event): void
    {
        ShipmentEventModel::create([
            'shipment_id' => $event->shipmentId,
            'type'        => $event->type,
            'payload'     => $event->payload,
            'occurred_at' => $event->occurredAt,
        ]);
    }

    public function exists(
        int $shipmentId,
        ShipmentEventType $type
    ): bool {
        return ShipmentEventModel::where('shipment_id', $shipmentId)
            ->where('type', $type->value)
            ->exists();
    }
}

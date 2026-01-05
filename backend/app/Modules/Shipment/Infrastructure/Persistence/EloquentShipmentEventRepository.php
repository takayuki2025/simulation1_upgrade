<?php

namespace App\Modules\Shipment\Infrastructure\Persistence;

use App\Modules\Shipment\Domain\Repository\ShipmentEventRepository;
use App\Modules\Shipment\Domain\Event\ShipmentEvent;
use App\Modules\Shipment\Domain\Event\ShipmentEventType;
use Illuminate\Support\Facades\DB;

final class EloquentShipmentEventRepository implements ShipmentEventRepository
{
    public function record(ShipmentEvent $event): void
    {
\Log::info('[🔥ShipmentEventRepository] record delivered', [
    'shipment_id' => $event->shipmentId,
]);

        DB::table('shipment_events')->insert([
            'shipment_id' => $event->shipmentId,
            'type'        => $event->type->value,
            'payload'     => json_encode($event->payload),
            'occurred_at' => $event->occurredAt,
            'created_at'  => now(),
        ]);
    }

    public function exists(
        int $shipmentId,
        ShipmentEventType $type
    ): bool {
        return DB::table('shipment_events')
            ->where('shipment_id', $shipmentId)
            ->where('type', $type->value)
            ->exists();
    }
}

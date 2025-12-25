<?php

namespace App\Modules\Shipment\Infrastructure\Persistence;

use App\Modules\Shipment\Domain\Event\ShipmentEvent;
use App\Modules\Shipment\Domain\Repository\ShipmentEventRepository;
use Illuminate\Support\Facades\DB;

final class EloquentShipmentEventRepository implements ShipmentEventRepository
{
    public function record(ShipmentEvent $event): void
    {
        DB::table('shipment_events')->insert([
            'shipment_id' => $event->shipmentId,
            'type' => $event->type,
            'payload' => json_encode($event->payload),
            'occurred_at' => $event->occurredAt,
        ]);
    }

    public function timeline(int $shipmentId): array
    {
        return DB::table('shipment_events')
            ->where('shipment_id', $shipmentId)
            ->orderBy('occurred_at')
            ->get()
            ->map(fn ($row) => [
                'type' => $row->type,
                'at' => $row->occurred_at,
            ])
            ->toArray();
    }
}

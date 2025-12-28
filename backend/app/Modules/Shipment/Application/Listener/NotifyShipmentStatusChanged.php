<?php

namespace App\Modules\Shipment\Application\Listener;

use App\Modules\Shipment\Domain\Event\ShipmentEvent;

final class NotifyShipmentStatusChanged
{
    public function handle(ShipmentEvent $event): void
    {
        match ($event->type) {
            'packed'     => \Log::info('梱包完了通知', ['shipment_id' => $event->shipmentId]),
            'shipped'    => \Log::info('発送通知', ['shipment_id' => $event->shipmentId]),
            'delivered'  => \Log::info('配達完了通知', ['shipment_id' => $event->shipmentId]),
            default      => null,
        };
    }
}

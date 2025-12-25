<?php

namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shipment\Domain\Repository\ShipmentEventRepository;
use App\Modules\Shipment\Domain\Event\ShipmentEvent;
use App\Modules\Shipment\Domain\Event\ShipmentEventType;

final class PackShipmentUseCase
{
    public function __construct(
        private ShipmentRepository $shipments,
        private ShipmentEventRepository $events,
    ) {
    }

    public function handle(int $shipmentId): void
    {
        $shipment = $this->shipments->find($shipmentId);
        $shipment->pack();

        $this->shipments->save($shipment);

        $this->events->record(new ShipmentEvent(
            shipmentId: $shipment->id,
            type: ShipmentEventType::PACKED->value,
            payload: [],
            occurredAt: now()
        ));
    }
}

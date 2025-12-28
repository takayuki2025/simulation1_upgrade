<?php

namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shipment\Domain\Repository\ShipmentEventRepository;
use App\Modules\Shipment\Domain\Event\ShipmentEvent;

final class DeliverShipmentUseCase
{
    public function __construct(
        private ShipmentRepository $shipments,
        private ShipmentEventRepository $events,
    ) {
    }

    public function handle(int $shipmentId): void
    {
        $shipment = $this->shipments->findById($shipmentId);
        $shipment->deliver();

        $this->shipments->save($shipment);
        $this->events->record(ShipmentEvent::delivered($shipment->id));
    }
}

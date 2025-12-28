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
        // ✅ 冪等ガード（これが超重要）
        if ($this->events->exists($shipmentId, ShipmentEventType::PACKED)) {
            return;
        }

        $shipment = $this->shipments->findById($shipmentId);

        // ここで CREATED 以外なら DomainException
        $shipment->pack();

        $this->shipments->save($shipment);

        $this->events->record(
            ShipmentEvent::packed($shipmentId)
        );
    }
}

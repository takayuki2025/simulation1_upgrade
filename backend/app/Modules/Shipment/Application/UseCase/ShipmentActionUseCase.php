<?php

namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shipment\Domain\Enum\ShipmentStatus;
use DomainException;

final class UpdateShipmentStatusUseCase
{
    public function __construct(
        private ShipmentRepository $shipments,
    ) {
    }

    public function pack(int $shipmentId): void
    {
        $shipment = $this->shipments->get($shipmentId);
        $shipment->pack();
        $this->shipments->save($shipment);
    }

    public function ship(int $shipmentId): void
    {
        $shipment = $this->shipments->get($shipmentId);
        $shipment->ship();
        $this->shipments->save($shipment);
    }

    public function inTransit(int $shipmentId): void
    {
        $shipment = $this->shipments->get($shipmentId);
        $shipment->markInTransit();
        $this->shipments->save($shipment);
    }

    public function deliver(int $shipmentId): void
    {
        $shipment = $this->shipments->get($shipmentId);
        $shipment->deliver();
        $this->shipments->save($shipment);
    }
}

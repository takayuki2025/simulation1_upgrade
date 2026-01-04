<?php

namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shipment\Domain\Repository\ShipmentEventRepository;
use App\Modules\Shipment\Domain\Event\ShipmentEvent;
use App\Modules\Shipment\Domain\Event\ShipmentEventType;
use Illuminate\Support\Facades\DB;

final class ShipShipmentUseCase
{
    public function __construct(
        private ShipmentRepository $shipments,
        private ShipmentEventRepository $events,
    ) {
    }

    public function handle(int $shipmentId): void
    {
        DB::transaction(function () use ($shipmentId) {

            if ($this->events->exists($shipmentId, ShipmentEventType::SHIPPED)) {
                return; // 冪等
            }

            $shipment = $this->shipments->findById($shipmentId);

            $shipment = $shipment->ship(
                new \DateTimeImmutable('+2 days') // 仮 ETA
            );

            $this->shipments->save($shipment);

            $this->events->record(
                ShipmentEvent::shipped($shipmentId)
            );
        });
    }
}

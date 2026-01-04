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
        $shipment = $this->shipments->findById($shipmentId);

        // ✅ Aggregate 基準の冪等ガード
        if ($shipment->status()->isPacked()) {
            return;
        }

        $packedShipment = $shipment->pack();

        $this->shipments->save($packedShipment);

        // Event は「結果」として記録
        if (! $this->events->exists($shipmentId, ShipmentEventType::PACKED)) {
            $this->events->record(
                ShipmentEvent::packed($shipmentId)
            );
        }
    }
}

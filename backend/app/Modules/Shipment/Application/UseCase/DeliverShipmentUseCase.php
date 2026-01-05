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

        // ★ 必ず戻り値を受け取る
        $deliveredShipment = $shipment->deliver();

        // ★ 新しいインスタンスを保存
        $this->shipments->save($deliveredShipment);

\Log::info('[🔥DeliverShipmentUseCase] called', ['shipment_id' => $shipmentId]);

        $this->events->record(
            ShipmentEvent::delivered($shipmentId)
        );
    }
}

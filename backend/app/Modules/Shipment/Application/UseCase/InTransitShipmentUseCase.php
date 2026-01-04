<?php

namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shipment\Domain\Repository\ShipmentEventRepository;
use App\Modules\Shipment\Domain\Event\ShipmentEvent;
use App\Modules\Shipment\Domain\Event\ShipmentEventType;
use Illuminate\Support\Facades\DB;

final class InTransitShipmentUseCase
{
    public function __construct(
        private ShipmentRepository $shipments,
        private ShipmentEventRepository $events,
    ) {
    }

    public function handle(int $shipmentId): void
    {
        DB::transaction(function () use ($shipmentId) {


            if ($shipment->status()->isInTransit()) {
                return;
            }

            // コメント化したらOKになった
            // if ($this->events->exists($shipmentId, ShipmentEventType::IN_TRANSIT)) {
            //     return; // 冪等
            // }

            $shipment = $this->shipments->findById($shipmentId);

            // ★ 必ず戻り値を受け取る
            $inTransitShipment = $shipment->markInTransit();

            // ★ 新しいインスタンスを保存
            $this->shipments->save($inTransitShipment);

            $this->events->record(
                ShipmentEvent::inTransit($shipmentId)
            );
        });
    }
}

<?php

namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Application\Dto\CreateShipmentInput;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shipment\Domain\Entity\Shipment;

final class CreateShipmentUseCase
{
    public function __construct(
        private ShipmentRepository $shipments,
    ) {
    }

    public function handle(CreateShipmentInput $input): void
    {
        \Log::info('[Shipment] CreateShipmentUseCase start', [
            'shop_id' => $input->shopId,
            'order_id' => $input->orderId,
        ]);

        $existing = $this->shipments->findByOrderId($input->orderId);

        if ($existing) {
            \Log::info('[Shipment] already exists, skip', [
                'order_id' => $input->orderId,
                'shipment_id' => $existing->id,
            ]);
            return;
        }

        $shipment = Shipment::createInitial(
            shopId: $input->shopId,
            orderId: $input->orderId,
        );

        $this->shipments->save($shipment);

        \Log::info('[Shipment] created', [
            'shipment_id' => $shipment->id,
            'order_id' => $shipment->orderId,
        ]);
    }
}

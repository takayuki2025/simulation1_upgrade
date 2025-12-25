<?php

namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Application\Dto\CreateShipmentInput;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shipment\Domain\Entity\Shipment;

final class CreateShipmentUseCase
{
    public function __construct(
        private ShipmentRepository $shipments
    ) {
    }

    public function handle(CreateShipmentInput $input): void
    {
        /**
         * 冪等性保証（OrderPaid が複数回飛んでも 1 Shipment）
         */
        if ($this->shipments->findByOrderId($input->orderId)) {
            return;
        }

        $shipment = Shipment::create(
            orderId: $input->orderId,
            shopId: $input->shopId,
            userId: $input->userId,
        );

        $this->shipments->save($shipment);
    }
}

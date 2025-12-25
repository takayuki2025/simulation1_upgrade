<?php

namespace App\Modules\Shipment\Application\Listener;

use App\Modules\Order\Domain\Event\OrderPaid;
use App\Modules\Shipment\Application\UseCase\CreateShipmentUseCase;
use App\Modules\Shipment\Application\Dto\CreateShipmentInput;

final class CreateShipmentOnOrderPaidListener
{
    public function __construct(
        private CreateShipmentUseCase $useCase
    ) {
    }

    public function handle(OrderPaid $event): void
    {
        \Log::info('[Shipment] OrderPaid received', [
            'order_id' => $event->orderId,
        ]);

        // ★ Shipment は UseCase に完全委譲する
        $this->useCase->handle(
            new CreateShipmentInput(
                shopId: $event->shopId,
                orderId: $event->orderId,
                userId: $event->userId,
            )
        );
    }
}

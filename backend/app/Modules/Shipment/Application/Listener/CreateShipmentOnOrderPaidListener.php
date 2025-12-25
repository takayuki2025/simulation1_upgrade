<?php

namespace App\Modules\Shipment\Application\Listener;

use App\Modules\Order\Domain\Event\OrderPaid; // ★ ここを変更
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Shipment\Application\Dto\CreateShipmentInput;
use App\Modules\Shipment\Application\UseCase\CreateShipmentUseCase;

final class CreateShipmentOnOrderPaidListener
{
    public function __construct(
        private OrderRepository $orders,
        private CreateShipmentUseCase $useCase,
    ) {
    }

    public function handle(OrderPaid $event): void
    {
        $order = $this->orders->findById($event->orderId);

        $address = $order->shippingAddress();
        if ($address === null) {
            throw new \LogicException('Shipping address missing for paid order.');
        }

        $input = new CreateShipmentInput(
            orderId: $event->orderId,
            shopId: $event->shopId,
            userId: $event->userId,
            shippingAddress: $address,
        );

        $this->useCase->handle($input);
    }
}

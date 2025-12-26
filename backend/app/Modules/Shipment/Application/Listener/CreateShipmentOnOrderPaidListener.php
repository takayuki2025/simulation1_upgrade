<?php

namespace App\Modules\Shipment\Application\Listener;

use App\Modules\Order\Domain\Event\OrderPaid;
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
        // ✅ Order Aggregate を唯一の情報源として取得
        $order = $this->orders->findById($event->orderId);

        $address = $order->shippingAddress();
        if ($address === null) {
            throw new \LogicException('Shipping address missing for paid order.');
        }

        // ✅ userId / shopId は Order から取得
        $input = new CreateShipmentInput(
            orderId: $order->id(),
            shopId: $order->shopId(),
            userId: $order->userId(),
            shippingAddress: $address,
        );

        $this->useCase->handle($input);
    }
}

<?php

namespace App\Modules\Shipment\Application\Listener;

use App\Modules\Order\Domain\Event\OrderPaid;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Shipment\Domain\Entity\Shipment;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;

final class CreateShipmentOnOrderPaidListener
{
    public function __construct(
        private OrderRepository $orders,
        private ShipmentRepository $shipments,
    ) {
    }

    public function handle(OrderPaid $event): void
    {
        // Order Aggregate を唯一の情報源とする
        $order = $this->orders->findById($event->orderId);

        $address = $order->shippingAddress();
        if ($address === null) {
            throw new \LogicException('Shipping address missing for paid order.');
        }

        // Shipment を直接生成（UseCase 不要）
        $shipment = Shipment::createInitial(
            shopId: $order->shopId(),
            orderId: $order->id(),
            destinationAddress: $address->toArray(),
        );

        $this->shipments->save($shipment);
    }
}

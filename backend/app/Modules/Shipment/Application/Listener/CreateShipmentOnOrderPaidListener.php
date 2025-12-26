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
        // ① すでに Shipment があれば何もしない（冪等）
        if ($this->shipments->existsByOrderId($event->orderId)) {
            return;
        }

        // ② Order Aggregate を唯一の情報源とする
        $order = $this->orders->findById($event->orderId);
        if (! $order) {
            return;
        }

        // ③ 住所が無ければ「まだ発送できない」だけなので return
        $address = $order->shippingAddress();
        if ($address === null) {
            return;
        }

        // ④ Shipment 作成
        $shipment = Shipment::createInitial(
            shopId: $order->shopId(),
            orderId: $order->id(),
            destinationAddress: $address->toArray(),
        );

        $this->shipments->save($shipment);
    }
}

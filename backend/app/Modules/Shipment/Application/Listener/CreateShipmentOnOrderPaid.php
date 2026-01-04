<?php

// app/Modules/Shipment/Application/Listener/CreateShipmentOnOrderPaid.php

namespace App\Modules\Shipment\Application\Listener;

use App\Modules\Order\Domain\Event\OrderPaid;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Shop\Domain\Repository\ShopRepository;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shipment\Domain\Entity\Shipment;

final class CreateShipmentOnOrderPaid
{
    public function __construct(
        private OrderRepository $orders,
        private ShopRepository $shops,
        private ShipmentRepository $shipments,
    ) {
    }

    public function handle(OrderPaid $event): void
    {
        // ① Order 取得
        $order = $this->orders->findById($event->orderId);
        if (! $order) {
            return;
        }

        // ② Shop 取得
        $shop = $this->shops->findById($event->shopId);
        if (! $shop) {
            return;
        }

        // ③ 冪等ガード（すでに Shipment があるなら何もしない）
        if ($this->shipments->existsByOrderId($order->id())) {
            return;
        }

        // ④ Shipment 作成（Aフェーズ正解ルート）
        $shipment = Shipment::createDraft(
            shopId: $shop->id(),
            orderId: $order->id(),
            originAddress: $shop->shippingAddress(),       // shop_addresses
            destinationAddress: $order->shippingAddress()  // orders.address_snapshot
        );

        // ⑤ 保存
        $this->shipments->save($shipment);
    }
}

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
        // // ① Order 取得
        // $order = $this->orders->findById($event->orderId);
        // if (! $order) {
        //     return;
        // }

        // // ② 住所未確定なら作らない
        // $address = $order->shippingAddress();
        // if ($address === null) {
        //     return;
        // }

        // // ③ 冪等作成（DB 制約に最終責任を委ねる）
        // try {
        //     if ($this->shipments->existsByOrderId($order->id())) {
        //         return;
        //     }

        //     $shipment = Shipment::createInitial(
        //         shopId: $order->shopId(),
        //         orderId: $order->id(),
        //         destinationAddress: $address->toArray(),
        //     );

        //     $this->shipments->save($shipment);

        //     \Log::info('[Shipment Created]', [
        //         'order_id' => $order->id(),
        //     ]);

        // } catch (\Illuminate\Database\QueryException $e) {
        //     // UNIQUE 制約違反は正常系（Stripe 二重イベント対策）
        //     if ((int)$e->errorInfo[1] === 1062) {
        //         \Log::info('[Shipment Already Exists]', [
        //             'order_id' => $order->id(),
        //         ]);
        //         return;
        //     }

        //     throw $e;
        return;
    }
}

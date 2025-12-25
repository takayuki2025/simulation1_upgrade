<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Order\Domain\Entity\Order;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Payment\Domain\Repository\PaymentRepository;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Order\Application\Dto\OrderHistoryItemOutput;

final class GetOrderHistoryUseCase
{
    public function __construct(
        private OrderRepository $orders,
        private PaymentRepository $payments,
        private ShipmentRepository $shipments,
    ) {
    }

    /**
     * @return OrderHistoryItemOutput[]
     */
    public function handle(int $userId): array
    {
        // ★ ここがポイント
        $orders = $this->orders->findByBuyer($userId);

        return array_map(
            fn (Order $order) => $this->mapOne($order),
            $orders
        );
    }

    private function mapOne(Order $order): OrderHistoryItemOutput
    {
        $payment  = $this->payments->findLatestByOrderId($order->id());
        $shipment = $this->shipments->findByOrderId($order->id());

        return new OrderHistoryItemOutput(
            orderId: $order->id(),
            orderStatus: $order->status()->value,
            paymentStatus: $payment?->status()->value,
            paymentMethod: $payment?->method()->value,
            hasShipment: $shipment !== null,
        );
    }
}

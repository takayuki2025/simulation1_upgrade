<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Order\Application\Dto\GetOrderDetailOutput;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Payment\Domain\Repository\PaymentRepository;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;

final class GetOrderDetailUseCase
{
    public function __construct(
        private OrderRepository $orders,
        private PaymentRepository $payments,
        private ShipmentRepository $shipments,
    ) {
    }

    public function handle(int $orderId, int $userId): GetOrderDetailOutput
    {
        $order = $this->orders->findById($orderId);
        if (! $order) {
            throw new \RuntimeException('Order not found');
        }

        if ($order->userId() !== $userId) {
            throw new \DomainException('Forbidden');
        }

        // ★ 最新 Payment（未払いでも必ず返る）
        $payment = $this->payments->findLatestByOrderId($orderId);

        // ★ Shipment は存在すれば返す
        $shipment = $this->shipments->findByOrderId($orderId);

        return GetOrderDetailOutput::from(
            $order,
            $payment,
            $shipment,
        );
    }
}

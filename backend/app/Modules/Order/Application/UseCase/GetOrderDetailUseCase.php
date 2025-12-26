<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Order\Application\Dto\GetOrderDetailOutput;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Payment\Domain\Repository\PaymentRepository; // ✅ ここ
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use DomainException;

final class GetOrderDetailUseCase
{
    public function __construct(
        private OrderRepository $orders,
        private PaymentRepository $payments,   // ✅ 差し替え
        private ShipmentRepository $shipments,
    ) {
    }

    public function handle(int $orderId, int $userId): GetOrderDetailOutput
    {
        $order = $this->orders->findById($orderId);

        if ((int) $order->userId() !== $userId) {
            throw new DomainException('Forbidden');
        }

        // ✅ 正しい Repository
        $payment  = $this->payments->findLatestByOrderId($orderId);
        $shipment = $this->shipments->findByOrderId($orderId);

        return GetOrderDetailOutput::from(
            order: $order,
            payment: $payment,
            shipment: $shipment,
        );
    }
}

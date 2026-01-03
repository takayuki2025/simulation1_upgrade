<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Order\Application\Dto\GetOrderDetailOutput;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Payment\Domain\Repository\PaymentRepository;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use DomainException;

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
        // ✅ ① 存在チェック
        $order = $this->orders->findById($orderId);

        if ($order === null) {
            throw new DomainException('Order not found');
        }

        // ✅ ② 所有者チェック
        if ($order->userId() !== $userId) {
            throw new DomainException('Forbidden');
        }

        // ✅ ③ 関連取得
        $payment  = $this->payments->findLatestByOrderId($orderId);
        $shipment = $this->shipments->findByOrderId($orderId);

        return GetOrderDetailOutput::from(
            order: $order,
            payment: $payment,
            shipment: $shipment,
        );
    }
}

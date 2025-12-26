<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


final class GetMyOrderShipmentUseCase
{
    public function __construct(
        private OrderRepository $orders,
        private ShipmentRepository $shipments,
    ) {
    }

    public function handle(int $userId, int $orderId): ?array
    {
        $order = $this->orders->findById($orderId);

        if (! $order) {
            return null;
        }

        // 🔒 自分の注文かチェック（最重要）
        if ($order->userId() !== $userId) {
            return null;
        }

        $shipment = $this->shipments->findByOrderId($orderId);

        if (! $shipment) {
            return null;
        }

        return [
            'id'     => $shipment->id,
            'status' => $shipment->status->value,
            'eta'    => $shipment->eta?->format('Y-m-d'),
            // 'timeline' => $shipment->timeline(), // array 前提
        ];
    }
}

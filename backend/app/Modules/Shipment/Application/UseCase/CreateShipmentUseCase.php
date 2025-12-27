<?php

namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Domain\Entity\Shipment;
use App\Modules\Shipment\Domain\Enum\ShipmentStatus;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Order\Domain\Repository\OrderRepository;

final class CreateShipmentUseCase
{
    public function __construct(
        private ShipmentRepository $shipments,
        private OrderRepository $orders,
    ) {
    }

    public function handle(int $orderId, int $shopId): void
    {
        // 二重作成防止（超重要）
        if ($this->shipments->existsByOrderId($orderId)) {
            return;
        }

        $order = $this->orders->findById($orderId);
        if (!$order) {
            return;
        }

        $shipment = new Shipment(
            id: null,
            shopId: $shopId,
            orderId: $orderId,
            status: ShipmentStatus::CREATED,
            originAddress: [],       // 倉庫 or 店舗住所（後で拡張）
            destinationAddress: $order->shippingAddress(),
            eta: null,
        );

        $this->shipments->save($shipment);
    }
}

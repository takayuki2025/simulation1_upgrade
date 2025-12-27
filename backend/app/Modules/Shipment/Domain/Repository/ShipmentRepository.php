<?php

namespace App\Modules\Shipment\Domain\Repository;

use App\Modules\Shipment\Domain\Entity\Shipment;

interface ShipmentRepository
{
    public function save(Shipment $shipment): Shipment;

    public function findByOrderId(int $orderId): ?Shipment;

    public function existsByOrderId(int $orderId): bool;

    /**
     * 店舗視点：注文に紐づく Shipment 参照（Read 用）
     */
    public function findByShopAndOrder(string $shopCode, int $orderId): ?array;

    /**
     * shipment_id からの再取得（Read 用）
     */
    public function findById(int $shipmentId): ?array;
}

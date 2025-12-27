<?php

namespace App\Modules\Shipment\Domain\Repository;

use App\Modules\Shipment\Domain\Entity\Shipment;

interface ShipmentRepository
{
    public function save(Shipment $shipment): Shipment;

    public function findByOrderId(int $orderId): ?Shipment;

    public function existsByOrderId(int $orderId): bool;

    /**
     * 店舗視点：注文に紐づく Shipment 参照
     * 返り値は Read 用の配列（Resource/DTO にしてもOK）
     */
    public function findByShopAndOrder(ShopCode $shopCode, int $orderId): ?array;

    /**
     * アクション後の再取得用（shipment_id から）
     */
    public function findById(int $shipmentId): ?array;
}

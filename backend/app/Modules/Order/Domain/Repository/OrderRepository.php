<?php

namespace App\Modules\Order\Domain\Repository;

use App\Modules\Order\Domain\Entity\Order;

interface OrderRepository
{
    public function findById(int $orderId): ?Order;

    public function findDraftByUser(int $orderId, int $userId): Order;

    public function save(Order $order): Order;

    /**
     * 購入者（buyer）別の注文一覧（新しい順）
     *
     * @return Order[]
     */
    public function findByBuyer(int $userId): array;
}

<?php

namespace App\Modules\Order\Domain\Repository;

use App\Modules\Order\Domain\Entity\Order;

interface OrderRepository
{
    public function save(Order $order): Order;

    public function findById(int $orderId): ?Order;

    /**
     * MyPage / Query 用
     */
    public function findByBuyer(int $userId): array;
}

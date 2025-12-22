<?php

namespace App\Modules\Order\Domain\Repository;

use App\Modules\Order\Domain\Entity\Order;

interface OrderRepository
{
    public function save(Order $order): Order;

    public function findById(int $orderId): ?Order;

    /**
     * Update status safely (used by payment/webhook)
     */
    public function updateStatus(int $orderId, string $status): void;
}

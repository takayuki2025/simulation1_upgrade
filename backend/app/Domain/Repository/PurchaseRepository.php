<?php

namespace App\Domain\Repository;

use App\Domain\Entity\OrderHistory;

interface PurchaseRepository
{
    public function saveOrderHistory(int $buyerId, int $itemId, int $price, string $stripeSessionId): OrderHistory;

    public function reduceItemStock(int $itemId, int $qty): bool;

    public function getItemForPurchase(int $itemId);

    public function getUserAddress(int $userId): array;

    public function updateAddress(int $userId, array $data): bool;
}

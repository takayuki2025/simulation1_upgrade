<?php

namespace App\Modules\Shop\Domain\Repository;

interface ShopLedgerRepository
{
    public function recordSale(
        int $shopId,
        int $amount,
        string $currency,
        int $orderId,
        int $paymentId,
        \DateTimeImmutable $occurredAt,
    ): void;
}

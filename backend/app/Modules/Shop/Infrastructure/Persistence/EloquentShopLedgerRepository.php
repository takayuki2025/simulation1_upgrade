<?php

namespace App\Modules\Shop\Infrastructure\Persistence;

use App\Models\ShopLedger as EloquentShopLedger;
use App\Modules\Shop\Domain\Repository\ShopLedgerRepository;
use App\Modules\Shop\Domain\Enum\LedgerType;

final class EloquentShopLedgerRepository implements ShopLedgerRepository
{
    public function recordSale(
        int $shopId,
        int $amount,
        string $currency,
        int $orderId,
        int $paymentId,
        \DateTimeImmutable $occurredAt,
    ): void {
        EloquentShopLedger::create([
            'shop_id'     => $shopId,
            'type'        => LedgerType::SALE->value,
            'amount'      => $amount,
            'currency'    => $currency,
            'order_id'    => $orderId,
            'payment_id'  => $paymentId,
            'meta'        => null,
            'occurred_at' => $occurredAt, // ← これだけ
        ]);
    }
}

<?php

namespace App\Modules\Shop\Infrastructure\Persistence;

use App\Modules\Shop\Domain\Entity\ShopLedger;
use App\Modules\Shop\Domain\Repository\ShopLedgerRepository;
use Illuminate\Support\Facades\DB;

final class EloquentShopLedgerRepository implements ShopLedgerRepository
{
    public function save(ShopLedger $entry): ShopLedger
    {
        if ($entry->id() === null) {
            $id = DB::table('shop_ledgers')->insertGetId([
                'shop_id'    => $entry->shopId(),
                'type'       => $entry->type(),
                'amount'     => $entry->amount(),
                'currency'   => $entry->currency(),
                'order_id'   => $entry->orderId(),
                'payment_id' => $entry->paymentId(),
                'meta'       => $entry->meta()
                    ? json_encode($entry->meta(), JSON_UNESCAPED_UNICODE)
                    : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return ShopLedger::reconstitute(
                id: (int) $id,
                shopId: $entry->shopId(),
                type: $entry->type(),
                amount: $entry->amount(),
                currency: $entry->currency(),
                orderId: $entry->orderId(),
                paymentId: $entry->paymentId(),
                meta: $entry->meta(),
            );
        }

        // Ledgerは原則 immutable。更新はメタ情報のみ許容
        DB::table('shop_ledgers')
            ->where('id', $entry->id())
            ->update([
                'meta'       => $entry->meta()
                    ? json_encode($entry->meta(), JSON_UNESCAPED_UNICODE)
                    : null,
                'updated_at' => now(),
            ]);

        return $entry;
    }

    public function listByShopId(
        int $shopId,
        int $limit = 100,
        int $offset = 0
    ): array {
        $rows = DB::table('shop_ledgers')
            ->where('shop_id', $shopId)
            ->orderByDesc('id')
            ->limit($limit)
            ->offset($offset)
            ->get();

        return $rows->map(fn ($row) => ShopLedger::reconstitute(
            id: (int) $row->id,
            shopId: (int) $row->shop_id,
            type: (string) $row->type,
            amount: (int) $row->amount,
            currency: (string) $row->currency,
            orderId: $row->order_id ? (int) $row->order_id : null,
            paymentId: $row->payment_id ? (int) $row->payment_id : null,
            meta: $row->meta ? json_decode($row->meta, true) : null,
        ))->all();
    }

    public function sumBalanceByShopId(int $shopId, string $currency): int
    {
        return (int) DB::table('shop_ledgers')
            ->where('shop_id', $shopId)
            ->where('currency', $currency)
            ->sum('amount');
    }
}

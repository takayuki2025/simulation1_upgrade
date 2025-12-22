<?php

namespace App\Modules\Order\Infrastructure\Persistence;

use App\Modules\Order\Domain\Entity\Order;
use App\Modules\Order\Domain\Enum\OrderStatus;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Order\Application\Dto\OrderItemSnapshot;
use Illuminate\Support\Facades\DB;

final class EloquentOrderRepository implements OrderRepository
{
    public function save(Order $order): Order
    {
        if ($order->id() === null) {
            $id = DB::table('orders')->insertGetId([
                'shop_id'        => $order->shopId(),
                'user_id'        => $order->userId(),
                'status'         => $order->status()->value,
                'total_amount'   => $order->totalAmount(),
                'currency'       => $order->currency(),
                'items_snapshot' => json_encode(array_map(fn (OrderItemSnapshot $s) => $s->toArray(), $order->items()), JSON_UNESCAPED_UNICODE),
                'meta'           => $order->meta() ? json_encode($order->meta(), JSON_UNESCAPED_UNICODE) : null,
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);

            return Order::reconstitute(
                id: (int) $id,
                shopId: $order->shopId(),
                userId: $order->userId(),
                status: $order->status(),
                totalAmount: $order->totalAmount(),
                currency: $order->currency(),
                items: $order->items(),
                meta: $order->meta(),
            );
        }

        DB::table('orders')->where('id', $order->id())->update([
            'status'     => $order->status()->value,
            'meta'       => $order->meta() ? json_encode($order->meta(), JSON_UNESCAPED_UNICODE) : null,
            'updated_at' => now(),
        ]);

        return $order;
    }

    public function findById(int $orderId): ?Order
    {
        $row = DB::table('orders')->where('id', $orderId)->first();
        if (! $row) {
            return null;
        }

        $itemsArr = json_decode($row->items_snapshot, true) ?? [];
        $items = array_map(fn ($r) => OrderItemSnapshot::fromArray($r), $itemsArr);

        $meta = $row->meta ? json_decode($row->meta, true) : null;

        return Order::reconstitute(
            id: (int) $row->id,
            shopId: (int) $row->shop_id,
            userId: (int) $row->user_id,
            status: OrderStatus::from((string) $row->status),
            totalAmount: (int) $row->total_amount,
            currency: (string) $row->currency,
            items: $items,
            meta: $meta
        );
    }

    public function updateStatus(int $orderId, string $status): void
    {
        DB::table('orders')->where('id', $orderId)->update([
            'status'     => $status,
            'updated_at' => now(),
        ]);
    }
}

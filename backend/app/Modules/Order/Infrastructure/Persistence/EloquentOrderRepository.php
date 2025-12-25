<?php

namespace App\Modules\Order\Infrastructure\Persistence;

use App\Modules\Order\Domain\Entity\Order;
use App\Modules\Order\Domain\Enum\OrderStatus;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Order\Application\Dto\OrderItemSnapshot;
use App\Modules\Order\Infrastructure\Persistence\Models\OrderModel;
use Illuminate\Support\Facades\DB;


final class EloquentOrderRepository implements OrderRepository
{
    public function save(Order $order): Order
    {
        if ($order->id() === null) {
            $model = OrderModel::create([
                'shop_id'        => $order->shopId(),
                'user_id'        => $order->userId(),
                'status'         => $order->status()->value,
                'total_amount'   => $order->totalAmount(),
                'currency'       => $order->currency(),
                'items_snapshot' => array_map(
                    fn (OrderItemSnapshot $s) => $s->toArray(),
                    $order->items()
                ),
                'meta' => $order->meta(),
            ]);

            return $this->toEntity($model);
        }

        $model = OrderModel::findOrFail($order->id());

        $model->update([
            'status' => $order->status()->value,
            'meta'   => $order->meta(),
        ]);

        return $this->toEntity($model);
    }

    public function findById(int $orderId): ?Order
    {
        $model = OrderModel::find($orderId);

        return $model ? $this->toEntity($model) : null;
    }

    /**
     * ★ MyPage Bought 用（正解）
     */
    public function findByBuyer(int $userId): array
    {
        return OrderModel::where('user_id', $userId)
            ->orderByDesc('id')
            ->get()
            ->map(fn (OrderModel $model) => $this->toEntity($model))
            ->all();
    }

    private function toEntity(OrderModel $model): Order
    {
        $items = array_map(
            fn (array $row) => OrderItemSnapshot::fromArray($row),
            $model->items_snapshot ?? []
        );

        return Order::reconstitute(
            id: (int) $model->id,
            shopId: (int) $model->shop_id,
            userId: (int) $model->user_id,
            status: OrderStatus::from($model->status),
            totalAmount: (int) $model->total_amount,
            currency: (string) $model->currency,
            items: $items,
            meta: $model->meta
        );
    }
}

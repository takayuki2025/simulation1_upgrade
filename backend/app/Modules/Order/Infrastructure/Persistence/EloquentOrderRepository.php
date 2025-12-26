<?php

namespace App\Modules\Order\Infrastructure\Persistence;

use App\Modules\Order\Domain\Entity\Order;
use App\Modules\Order\Domain\Enum\OrderStatus;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Order\Domain\ValueObject\Address;
use App\Modules\Order\Application\Dto\OrderItemSnapshot;
use App\Modules\Order\Infrastructure\Persistence\Models\OrderModel;

final class EloquentOrderRepository implements OrderRepository
{
    public function findById(int $orderId): Order
    {
        $model = OrderModel::findOrFail($orderId);
        return $this->reconstituteOrder($model);
    }

    public function findDraftByUser(int $orderId, int $userId): Order
    {
        $model = OrderModel::where('id', $orderId)
            ->where('user_id', $userId)
            ->where('status', OrderStatus::PENDING_PAYMENT->value)
            ->firstOrFail();

        return $this->reconstituteOrder($model);
    }

    public function save(Order $order): Order
    {
        $model = $order->id()
            ? OrderModel::findOrFail($order->id())
            : new OrderModel();

        $model->shop_id = $order->shopId();
        $model->user_id = $order->userId();
        $model->status = $order->status()->value;
        $model->total_amount = $order->totalAmount();
        $model->currency = $order->currency();

        $model->items_snapshot = array_map(
            fn (OrderItemSnapshot $item) => $item->toArray(),
            $order->items()
        );

        $model->meta = $order->meta();

        // Address snapshot（あれば）
        if ($order->shippingAddress()) {
            $address = $order->shippingAddress();

            $model->shipping_postal_code = $address->postalCode;
            $model->shipping_prefecture = $address->prefecture;
            $model->shipping_city = $address->city;
            $model->shipping_address_line1 = $address->addressLine1;
            $model->shipping_address_line2 = $address->addressLine2;
            $model->shipping_recipient_name = $address->recipientName;
            $model->shipping_phone = $address->phone;
            $model->address_snapshot_at = $order->addressSnapshotAt();
        }

        $model->save();

        return Order::reconstitute(
            id: $model->id,
            shopId: $model->shop_id,
            userId: $model->user_id,
            status: OrderStatus::from($model->status),
            totalAmount: $model->total_amount,
            currency: $model->currency,
            items: array_map(
                fn (array $row) => OrderItemSnapshot::fromArray($row),
                $model->items_snapshot
            ),
            meta: $model->meta,
        );
    }

    /**
     * @return Order[]
     */
    public function findByBuyer(int $userId): array
    {
        $models = OrderModel::query()
            ->where('user_id', $userId)
            ->orderByDesc('id')
            ->get();

        return $models
            ->map(fn (OrderModel $m) => $this->reconstituteOrder($m))
            ->all();
    }

    // ==========================
    // Reconstitution（復元）
    // ==========================
    private function reconstituteOrder(OrderModel $model): Order
    {
        $items = array_map(
            fn (array $row) => OrderItemSnapshot::fromArray($row),
            $model->items_snapshot
        );

        $address = null;
        $snapshotAt = null;

        if ($model->shipping_postal_code) {
            $address = new Address(
                postalCode: $model->shipping_postal_code,
                prefecture: $model->shipping_prefecture,
                city: $model->shipping_city,
                addressLine1: $model->shipping_address_line1,
                addressLine2: $model->shipping_address_line2,
                recipientName: $model->shipping_recipient_name,
                phone: $model->shipping_phone,
            );

            $snapshotAt = $model->address_snapshot_at
                ? $model->address_snapshot_at->toDateTimeImmutable()
                : null;
        }

        return Order::reconstitute(
            id: $model->id,
            shopId: $model->shop_id,
            userId: $model->user_id,
            status: OrderStatus::from($model->status),
            totalAmount: $model->total_amount,
            currency: $model->currency,
            items: $items,
            meta: $model->meta,
            shippingAddress: $address,
            addressSnapshotAt: $snapshotAt,
        );
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

    public function findByShop(int $shopId): array
    {
        $models = OrderModel::query()
            ->where('shop_id', $shopId)
            ->orderByDesc('id')
            ->get();

        return $models
            ->map(fn (OrderModel $m) => $this->reconstituteOrder($m))
            ->all();
    }
}

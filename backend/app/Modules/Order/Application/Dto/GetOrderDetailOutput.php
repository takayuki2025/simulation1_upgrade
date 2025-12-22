<?php

namespace App\Modules\Order\Application\Dto;

use App\Modules\Order\Domain\Entity\Order;

final class GetOrderDetailOutput
{
    public function __construct(
        public readonly int $orderId,
        public readonly int $shopId,
        public readonly int $userId,
        public readonly string $status,
        public readonly int $totalAmount,
        public readonly string $currency,
        /** @var array<int, array> */
        public readonly array $items,
        public readonly ?array $meta,
    ) {
    }

    public static function from(Order $order): self
    {
        return new self(
            orderId: $order->id() ?? 0,
            shopId: $order->shopId(),
            userId: $order->userId(),
            status: $order->status()->value,
            totalAmount: $order->totalAmount(),
            currency: $order->currency(),
            items: array_map(fn ($s) => $s->toArray(), $order->items()),
            meta: $order->meta()
        );
    }

    public function toArray(): array
    {
        return [
            'order_id'     => $this->orderId,
            'shop_id'      => $this->shopId,
            'user_id'      => $this->userId,
            'status'       => $this->status,
            'total_amount' => $this->totalAmount,
            'currency'     => $this->currency,
            'items'        => $this->items,
            'meta'         => $this->meta,
        ];
    }
}

<?php

namespace App\Modules\Order\Application\Dto;

use App\Modules\Order\Domain\Entity\Order;

final class ShopOrderListOutput
{
    public function __construct(
        public int $orderId,
        public int $buyerUserId,
        public string $status,
        public int $totalAmount,
        public string $currency,
        // public ?string $paidAt,
    ) {
    }

    public static function fromEntity(Order $order): self
    {
        return new self(
            orderId: $order->id(),
            buyerUserId: $order->userId(),
            status: $order->status()->value,
            totalAmount: $order->totalAmount(),
            currency: $order->currency(),
            // paidAt: $order->paidAt()?->format('Y-m-d H:i:s'),
        );
    }

    public function toArray(): array
    {
        return [
            'order_id' => $this->orderId,
            'buyer_user_id' => $this->buyerUserId,
            'status' => $this->status,
            'total_amount' => $this->totalAmount,
            'currency' => $this->currency,
            // 'paid_at' => $this->paidAt,
        ];
    }
}

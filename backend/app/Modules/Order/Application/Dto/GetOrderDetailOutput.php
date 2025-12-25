<?php

namespace App\Modules\Order\Application\Dto;

use App\Modules\Order\Domain\Entity\Order;
use App\Modules\Payment\Domain\Entity\Payment;
use App\Modules\Shipment\Domain\Entity\Shipment;

final class GetOrderDetailOutput
{
    public function __construct(
        public readonly int $orderId,
        public readonly int $shopId,
        public readonly int $userId,
        public readonly string $orderStatus,
        public readonly int $totalAmount,
        public readonly string $currency,
        public readonly ?array $payment,
        public readonly ?array $shipment,
    ) {
    }

    public static function from(
        Order $order,
        ?Payment $payment,
        ?Shipment $shipment,
    ): self {
        return new self(
            orderId: $order->id(),
            shopId: $order->shopId(),
            userId: $order->userId(),
            orderStatus: $order->status()->value,
            totalAmount: $order->totalAmount(),
            currency: $order->currency(),
            payment: $payment ? [
                'payment_id' => $payment->id(),
                'method' => $payment->method()->value,
                'status' => $payment->status()->value,
                'instructions' => $payment->instructions(),
                'method_details' => $payment->methodDetails(),
            ] : null,
            shipment: $shipment ? [
                'shipment_id' => $shipment->id(),
                'status' => $shipment->status()->value,
                'eta' => $shipment->eta()?->toAtomString(),
            ] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'order_id' => $this->orderId,
            'shop_id' => $this->shopId,
            'user_id' => $this->userId,
            'order_status' => $this->orderStatus,
            'total_amount' => $this->totalAmount,
            'currency' => $this->currency,
            'payment' => $this->payment,
            'shipment' => $this->shipment,
        ];
    }
}

<?php

namespace App\Modules\Order\Domain\Entity;

use App\Modules\Order\Domain\Enum\OrderStatus;
use App\Modules\Order\Application\Dto\OrderItemSnapshot;
use App\Modules\Order\Domain\ValueObject\Address;
use DomainException;

final class Order
{
    /**
     * @param OrderItemSnapshot[] $items
     */
    private function __construct(
        private ?int $id,
        private int $shopId,
        private int $userId,
        private OrderStatus $status,
        private int $totalAmount,
        private string $currency,
        private array $items,
        private ?array $meta,
        private ?Address $shippingAddress = null,
        private ?\DateTimeImmutable $addressSnapshotAt = null,
    ) {
        if ($this->totalAmount < 0) {
            throw new \InvalidArgumentException('totalAmount must be >= 0');
        }
        if ($this->currency === '') {
            throw new \InvalidArgumentException('currency is required');
        }
        if (count($this->items) === 0) {
            throw new \InvalidArgumentException('items must not be empty');
        }
    }

    /**
     * 新規作成（未保存）
     *
     * @param OrderItemSnapshot[] $items
     */
    public static function create(
        int $shopId,
        int $userId,
        int $totalAmount,
        string $currency,
        array $items,
        ?array $meta = null
    ): self {
        return new self(
            id: null,
            shopId: $shopId,
            userId: $userId,
            status: OrderStatus::PENDING_PAYMENT,
            totalAmount: $totalAmount,
            currency: $currency,
            items: $items,
            meta: $meta
        );
    }

    /**
     * 永続化データから再構築
     *
     * @param OrderItemSnapshot[] $items
     */
    public static function reconstitute(
        int $id,
        int $shopId,
        int $userId,
        OrderStatus $status,
        int $totalAmount,
        string $currency,
        array $items,
        ?array $meta = null,
        ?Address $shippingAddress = null,
        ?\DateTimeImmutable $addressSnapshotAt = null,
    ): self {
        return new self(
            id: $id,
            shopId: $shopId,
            userId: $userId,
            status: $status,
            totalAmount: $totalAmount,
            currency: $currency,
            items: $items,
            meta: $meta,
            shippingAddress: $shippingAddress,
            addressSnapshotAt: $addressSnapshotAt,
        );
    }

    // ========================
    // Getters
    // ========================

    public function id(): ?int
    {
        return $this->id;
    }

    public function shopId(): int
    {
        return $this->shopId;
    }

    public function userId(): int
    {
        return $this->userId;
    }

    public function status(): OrderStatus
    {
        return $this->status;
    }

    public function totalAmount(): int
    {
        return $this->totalAmount;
    }

    public function currency(): string
    {
        return $this->currency;
    }

    /** @return OrderItemSnapshot[] */
    public function items(): array
    {
        return $this->items;
    }

    public function meta(): ?array
    {
        return $this->meta;
    }

    // ========================
    // State transitions
    // ========================

    public function markPaid(): self
    {
        if ($this->status !== OrderStatus::PENDING_PAYMENT) {
            throw new \DomainException(
                'Order cannot be marked paid from status: ' . $this->status->value
            );
        }

        return self::reconstitute(
            id: $this->id ?? 0,
            shopId: $this->shopId,
            userId: $this->userId,
            status: OrderStatus::PAID,
            totalAmount: $this->totalAmount,
            currency: $this->currency,
            items: $this->items,
            meta: $this->meta,
            shippingAddress: $this->shippingAddress,
            addressSnapshotAt: $this->addressSnapshotAt,
        );
    }

    public function cancel(): self
    {
        if (!in_array($this->status, [OrderStatus::PENDING_PAYMENT, OrderStatus::PAYMENT_FAILED], true)) {
            throw new \DomainException('Order cannot be cancelled from status: ' . $this->status->value);
        }

        return self::reconstitute(
            id: $this->id ?? 0,
            shopId: $this->shopId,
            userId: $this->userId,
            status: OrderStatus::CANCELLED,
            totalAmount: $this->totalAmount,
            currency: $this->currency,
            items: $this->items,
            meta: $this->meta,
            shippingAddress: $this->shippingAddress,
            addressSnapshotAt: $this->addressSnapshotAt,
        );
    }

    public function confirmAddress(
        Address $address,
        \DateTimeImmutable $now
    ): void {
        if ($this->status !== OrderStatus::PENDING_PAYMENT) {
            throw new DomainException(
                'Address can only be fixed before payment'
            );
        }

        $this->shippingAddress = $address;
        $this->addressSnapshotAt = $now;
    }

    public function shippingAddress(): ?Address
    {
        return $this->shippingAddress;
    }

    public function addressSnapshotAt(): ?\DateTimeImmutable
    {
        return $this->addressSnapshotAt;
    }
}

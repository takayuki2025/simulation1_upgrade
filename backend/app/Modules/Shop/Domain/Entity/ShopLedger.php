<?php

namespace App\Modules\Shop\Domain\Entity;

final class ShopLedger
{
    private function __construct(
        private ?int $id,
        private int $shopId,
        private string $type,
        private int $amount,
        private string $currency,
        private ?int $orderId,
        private ?int $paymentId,
        private ?array $meta,
    ) {
        if ($currency === '') {
            throw new \InvalidArgumentException('currency is required');
        }
        if ($type === '') {
            throw new \InvalidArgumentException('type is required');
        }
    }

    /**
     * 売上・返金・手数料などの記録
     */
    public static function record(
        int $shopId,
        string $type,
        int $amount,
        string $currency,
        ?int $orderId = null,
        ?int $paymentId = null,
        ?array $meta = null,
    ): self {
        return new self(
            id: null,
            shopId: $shopId,
            type: $type,
            amount: $amount,
            currency: $currency,
            orderId: $orderId,
            paymentId: $paymentId,
            meta: $meta
        );
    }

    /**
     * DB からの復元用（将来使用）
     */
    public static function reconstitute(
        int $id,
        int $shopId,
        string $type,
        int $amount,
        string $currency,
        ?int $orderId,
        ?int $paymentId,
        ?array $meta,
    ): self {
        return new self(
            id: $id,
            shopId: $shopId,
            type: $type,
            amount: $amount,
            currency: $currency,
            orderId: $orderId,
            paymentId: $paymentId,
            meta: $meta
        );
    }

    // getters
    public function id(): ?int
    {
        return $this->id;
    }
    public function shopId(): int
    {
        return $this->shopId;
    }
    public function type(): string
    {
        return $this->type;
    }
    public function amount(): int
    {
        return $this->amount;
    }
    public function currency(): string
    {
        return $this->currency;
    }
    public function orderId(): ?int
    {
        return $this->orderId;
    }
    public function paymentId(): ?int
    {
        return $this->paymentId;
    }
    public function meta(): ?array
    {
        return $this->meta;
    }
}

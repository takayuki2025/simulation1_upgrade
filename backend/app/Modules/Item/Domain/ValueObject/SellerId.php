<?php

namespace App\Modules\Item\Domain\ValueObject;

use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;

final class SellerId
{
    /**
     * @param SellerType $type  INDIVIDUAL | SHOP
     * @param int        $id    user_id or shop_id
     */
    private function __construct(
        private SellerType $type,
        private int $id,
    ) {
    }

    /* ========= Factory ========= */

    public static function user(int $userId): self
    {
        return new self(SellerType::INDIVIDUAL, $userId);
    }

    public static function shop(int $shopId): self
    {
        return new self(SellerType::SHOP, $shopId);
    }

    /* ========= Getter ========= */

    public function type(): SellerType
    {
        return $this->type;
    }

    public function id(): int
    {
        return $this->id;
    }

    /* ========= Helper ========= */

    // ★ v1 Publish 用（追加）
    public function isUser(): bool
    {
        return $this->type === SellerType::INDIVIDUAL;
    }

    // ★ v1 Publish 用（追加）
    public function isShop(): bool
    {
        return $this->type === SellerType::SHOP;
    }

    // ★ v1 Publish 用（追加）
    public function userId(): int
    {
        if (! $this->isUser()) {
            throw new \LogicException('Seller is not individual user');
        }
        return $this->id;
    }

    /* ========= Authorization ========= */

    // ✅ これは絶対に消さない（正しい）
    public function belongsTo(AuthPrincipal $principal): bool
    {
        return match ($this->type) {
            SellerType::INDIVIDUAL =>
                (int)$principal->providerUid === $this->id,

            SellerType::SHOP =>
                in_array($this->id, $principal->shopIds ?? [], true),
        };
    }

    public function isIndividual(): bool
    {
        return $this->type === SellerType::INDIVIDUAL;
    }

    public function asString(): string
    {
        return sprintf('%s:%d', $this->type->value, $this->id);
    }
}

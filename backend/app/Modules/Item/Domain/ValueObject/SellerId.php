<?php

namespace App\Modules\Item\Domain\ValueObject;

use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use Illuminate\Support\Facades\DB;

final class SellerId
{
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

    public function isIndividual(): bool
    {
        return $this->type === SellerType::INDIVIDUAL;
    }

    public function isShop(): bool
    {
        return $this->type === SellerType::SHOP;
    }

    public function belongsTo(AuthPrincipal $principal): bool
    {
        return match ($this->type) {
            SellerType::INDIVIDUAL =>
                $principal->userId === $this->id,

            SellerType::SHOP =>
                in_array($this->id, $principal->shopIds ?? [], true)
                || $this->isOwnedFreeShopBy($principal),
        };
    }

    private function isOwnedFreeShopBy(AuthPrincipal $principal): bool
    {
        return DB::table('shops')
            ->where('id', $this->id)
            ->where('owner_user_id', $principal->userId)
            ->exists();
    }

    /**
     * デバッグ・ログ用途のみ
     */
    public function asString(): string
    {
        return sprintf('%s:%d', $this->type->value, $this->id);
    }
}

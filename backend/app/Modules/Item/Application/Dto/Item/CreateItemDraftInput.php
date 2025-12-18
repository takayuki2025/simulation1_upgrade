<?php

namespace App\Modules\Item\Application\Dto\Item;

final class CreateItemDraftInput
{
    public function __construct(
        public readonly string $sellerId,
        public readonly string $name,
        public readonly int $priceAmount,
        public readonly string $priceCurrency,
        public readonly ?string $brandRaw,
    ) {}
}
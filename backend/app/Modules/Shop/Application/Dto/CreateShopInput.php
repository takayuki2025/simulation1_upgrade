<?php

namespace App\Modules\Shop\Application\Dto;

final class CreateShopInput
{
    public function __construct(
        public readonly int $ownerUserId,
        public readonly string $name,
    ) {
    }
}

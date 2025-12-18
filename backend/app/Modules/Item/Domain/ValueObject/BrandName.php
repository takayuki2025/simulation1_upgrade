<?php

namespace App\Modules\Item\Domain\ValueObject;

final class BrandName
{
    public function __construct(
        private string $raw
    ) {}

    public function raw(): string
    {
        return $this->raw;
    }
}
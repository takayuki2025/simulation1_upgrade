<?php

namespace App\Modules\Item\Domain\ValueObject;

use Ramsey\Uuid\Uuid;
use Illuminate\Support\Str;

final class ItemDraftId
{
    private function __construct(
        private string $value
    ) {}

    public static function generate(): self
    {
        return new self(Str::uuid()->toString());
    }

    public static function restore(string $value): self
    
    {
        return new self($value);
    }

    public function value(): string
    {
        return $this->value;
    }
}



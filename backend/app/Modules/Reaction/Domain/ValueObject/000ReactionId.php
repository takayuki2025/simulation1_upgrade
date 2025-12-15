<?php

namespace App\Modules\Reaction\Domain\ValueObject;

final class ReactorId
{
    public function __construct(private readonly int $value)
    {
        if ($value <= 0) {
            throw new \InvalidArgumentException('ReactorId must be positive.');
        }
    }

    public function value(): int
    {
        return $this->value;
    }
}

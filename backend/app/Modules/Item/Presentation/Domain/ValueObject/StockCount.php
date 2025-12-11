<?php

namespace App\Modules\Item\Presentation\Domain\ValueObject;

class StockCount
{
    public function __construct(
        private int $value
    ) {
        if ($value < 0) {
            throw new \InvalidArgumentException('Stock cannot be negative');
        }
    }

    public function getValue(): int
    {
        return $this->value;
    }

    public function decrease(int $amount): self
    {
        if ($amount < 0) {
            throw new \InvalidArgumentException('Amount must be positive');
        }

        $new = $this->value - $amount;
        if ($new < 0) {
            throw new \DomainException('Stock would become negative');
        }

        return new self($new);
    }

    public function increase(int $amount): self
    {
        if ($amount < 0) {
            throw new \InvalidArgumentException('Amount must be positive');
        }

        return new self($this->value + $amount);
    }

    public function isZero(): bool
    {
        return $this->value === 0;
    }
}

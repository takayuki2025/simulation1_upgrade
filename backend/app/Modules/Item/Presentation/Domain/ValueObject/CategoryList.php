<?php

namespace App\Modules\Item\Presentation\Domain\ValueObject;

class CategoryList
{
    public function __construct(
        private array $values
    ) {
    }

    public function getValues(): array
    {
        return $this->values;
    }
}

<?php



namespace App\Modules\Item\Domain\ValueObject;

final class ItemImagePath
{
    public function __construct(
        private string $value
    ) {
        if ($value === '') {
            throw new \InvalidArgumentException('ItemImagePath cannot be empty');
        }
    }

    public function getValue(): string
    {
        return $this->value;
    }
}


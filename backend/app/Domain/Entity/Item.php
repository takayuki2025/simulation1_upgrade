<?php

namespace App\Domain\Entity;

class Item
{
    public function __construct(
        public int $id,
        public string $name,
        public int $price,
        public int $remain,
    ) {
    }
}

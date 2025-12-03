<?php

namespace App\Domain\Entity;

class Favorite
{
    public function __construct(
        public int $id,
        public int $userId,
        public int $itemId,
    ) {
    }
}

<?php

namespace App\Domain\Entity;

class Comment
{
    public function __construct(
        public int $id,
        public int $itemId,
        public int $userId,
        public string $comment,
        public string $createdAt,
    ) {
    }
}

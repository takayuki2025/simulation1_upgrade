<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Comment;

interface CommentRepository
{
    public function create(int $userId, int $itemId, string $comment): Comment;

    public function findByItem(int $itemId): array;
}

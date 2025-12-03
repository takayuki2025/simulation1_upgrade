<?php

namespace App\Application\UseCase\Comment;

use App\Domain\Repository\CommentRepository;

class CommentUseCase
{
    public function __construct(private CommentRepository $comments)
    {
    }

    /** コメント投稿 */
    public function post(int $userId, int $itemId, string $comment)
    {
        return $this->comments->create($userId, $itemId, $comment);
    }

    /** コメント一覧 */
    public function listByItem(int $itemId)
    {
        return $this->comments->findByItem($itemId);
    }
}

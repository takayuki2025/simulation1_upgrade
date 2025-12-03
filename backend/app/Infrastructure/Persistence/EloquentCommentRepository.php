<?php

namespace App\Infrastructure\Persistence;

use App\Domain\Repository\CommentRepository;
use App\Domain\Entity\Comment;
use App\Models\Comments;

class EloquentCommentRepository implements CommentRepository
{
    public function create(int $userId, int $itemId, string $comment): Comment
    {
        $model = Comments::create([
            'user_id' => $userId,
            'item_id' => $itemId,
            'comment' => $comment,
        ]);

        return new Comment(
            id: $model->id,
            itemId: $model->item_id,
            userId: $model->user_id,
            comment: $model->comment,
            createdAt: $model->created_at->toDateTimeString()
        );
    }

    public function findByItem(int $itemId): array
    {
        return Comments::where('item_id', $itemId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($c) => new Comment(
                id: $c->id,
                itemId: $c->item_id,
                userId: $c->user_id,
                comment: $c->comment,
                createdAt: $c->created_at->toDateTimeString()
            ))
            ->all();
    }
}

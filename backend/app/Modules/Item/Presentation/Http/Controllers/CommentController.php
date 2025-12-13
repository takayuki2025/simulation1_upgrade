<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Item\Application\UseCase\Item\CreateCommentUseCase;

class CommentController extends Controller
{
    public function __invoke(Request $request, CreateCommentUseCase $useCase)
    {
        $validated = $request->validate([
            'item_id' => ['required', 'integer', 'exists:items,id'],
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        $comment = $useCase->execute(
            userId: $request->user()->id,
            itemId: $validated['item_id'],
            comment: $validated['comment'],
        );

        return response()->json([
            'message' => 'コメントを投稿しました',
            'comment' => $comment
        ], 201);
    }
}

<?php

namespace App\Modules\Comment\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Comment\Application\UseCase\PostCommentUseCase;

final class CommentController extends Controller
{
    public function __invoke(Request $request, PostCommentUseCase $useCase)
    {
        $validated = $request->validate([
            'item_id' => ['required', 'integer'],
            'comment' => ['required', 'string'],
        ]);

        return response()->json(
            $useCase->execute(
                userId: $request->user()->id,
                itemId: $validated['item_id'],
                body: $validated['comment'],
            ),
            201
        );
    }
}


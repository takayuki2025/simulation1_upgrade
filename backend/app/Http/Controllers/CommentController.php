<?php

namespace App\Http\Controllers;

use App\Application\UseCase\CommentUseCase;
use App\Http\Requests\CommentRequest;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function list(int $itemId, CommentUseCase $useCase)
    {
        return response()->json($useCase->listByItem($itemId));
    }

    public function create(CommentRequest $req, CommentUseCase $useCase)
    {
        return response()->json(
            $useCase->post(
                userId: $req->user()->id,
                itemId: $req->input('item_id'),
                text: $req->input('comment')
            )
        );
    }
}

<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Item\Application\UseCase\Item\Query\GetItemDetailUseCase;
use App\Modules\Item\Presentation\Http\Resources\ItemDetailResource;

final class ItemDetailController extends Controller
{
    public function __invoke(
        int $id,
        Request $request,
        GetItemDetailUseCase $useCase
    ) {
        $viewerUserId = $request->user()?->id;

        $output = $useCase->execute($id, $viewerUserId);

        return response()->json([
            'item'           => ItemDetailResource::fromReadModel($output->itemRow),
            'comments'       => $output->comments,
            'isFavorited'    => $output->isFavorited,
            'favoritesCount' => $output->favoritesCount,
        ]);
    }
}

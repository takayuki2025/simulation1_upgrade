<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Modules\Item\Application\UseCase\Item\Command\PublishItemUseCase;
use App\Modules\Item\Application\Dto\Item\PublishItemInput;
use App\Modules\Auth\Application\Service\AuthContext;

final class PublishItemController extends Controller
{
    public function __construct(
        private PublishItemUseCase $useCase,
        private AuthContext $authContext,
    ) {
    }

    public function __invoke(
        Request $request,
        string $draftId,
    ): JsonResponse {
        // ✅ AuthContext から principal を取得
        $principal = $this->authContext->principal();

        if (! $principal) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // DTO は Controller の責務
        $input = new PublishItemInput(
            draftId: $draftId,
        );

        // ✅ UseCase に明示的に渡す
        $this->useCase->execute(
            $input,
            $principal,
            null, // tenantId（未使用なら null）
        );

        return response()->json(['status' => 'ok']);
    }
}

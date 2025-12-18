<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Modules\Item\Application\UseCase\Item\Command\PublishItemUseCase;
use App\Modules\Item\Application\Dto\Item\PublishItemInput;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;

final class PublishItemController extends Controller
{
    public function __construct(
        private PublishItemUseCase $useCase,
    ) {}

    public function __invoke(Request $request, string $draftId): JsonResponse
    {
        // AuthPrincipal 取得（Middleware inject 前提）
        $principal = $request->attributes->get('auth_principal');
        if (! $principal instanceof AuthPrincipal) {
            throw new \RuntimeException('AuthPrincipal not found');
        }

        // tenant_id（shop 出品時のみ意味を持つ）
        $tenantId = $request->attributes->get('tenant_id');

        $output = $this->useCase->execute(
            new PublishItemInput($draftId),
            $principal,
            $tenantId
        );

        return response()->json([
            'item_id' => $output->itemId,
            'status'  => $output->status,
        ], 200);
    }
}
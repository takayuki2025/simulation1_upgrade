<?php

namespace App\Modules\Order\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Order\Application\UseCase\GetOrderDetailUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class OrderDetailController extends Controller
{
    public function __construct(
        private GetOrderDetailUseCase $useCase,
    ) {
    }

    /**
     * GET /api/me/orders/{orderId}
     * - 認証必須
     * - 自分の注文のみ閲覧可
     */
    public function __invoke(Request $request, int $orderId): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $output = $this->useCase->handle(
            orderId: $orderId,
            userId: (int) $user->id,
        );

        return response()->json($output->toArray(), 200);
    }
}

<?php

namespace App\Modules\Order\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Order\Application\UseCase\GetOrderDetailUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class OrderReadController extends Controller
{
    public function __construct(
        private GetOrderDetailUseCase $useCase
    ) {
    }

    public function show(Request $request, int $orderId): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $out = $this->useCase->handle($orderId, (int)$user->id);

        return response()->json($out->toArray(), 200);
    }
}

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

    public function __invoke(Request $request, int $orderId): JsonResponse
    {
        $userId = (int) $request->user()->id;

        $output = $this->useCase->handle(
            orderId: $orderId,
            userId: $userId
        );

        return response()->json($output->toArray());
    }
}

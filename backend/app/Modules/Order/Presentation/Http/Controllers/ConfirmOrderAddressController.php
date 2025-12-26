<?php

namespace App\Modules\Order\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Order\Application\UseCase\ConfirmOrderAddressUseCase;
use Illuminate\Http\Request;

final class ConfirmOrderAddressController extends Controller
{
    public function __construct(
        private ConfirmOrderAddressUseCase $useCase
    ) {
    }

    /**
     * POST /api/orders/{orderId}/confirm-address
     */
    public function __invoke(Request $request, int $orderId)
    {
        $this->useCase->handle(
            orderId: $orderId,
            addressId: (int) $request->input('address_id'),
        );

        return response()->json([
            'status' => 'ok',
        ]);
    }
}

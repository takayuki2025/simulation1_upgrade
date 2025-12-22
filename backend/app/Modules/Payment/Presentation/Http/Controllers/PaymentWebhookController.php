<?php

namespace App\Modules\Payment\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Payment\Application\UseCase\HandlePaymentWebhookUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PaymentWebhookController extends Controller
{
    public function __construct(
        private HandlePaymentWebhookUseCase $useCase
    ) {
    }

    /**
     * POST /api/payments/webhook/stripe
     * Stripe webhook (no auth)
     */
    public function stripe(Request $request): JsonResponse
    {
        return response()->json(
            $this->useCase->handle(
                $request->getContent(),
                (string) $request->header('Stripe-Signature')
            )
        );
    }
}

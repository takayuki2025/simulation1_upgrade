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
        $payload = $request->getContent();
        $headers = $request->headers->all();

        // normalize header
        $sig = $request->header('Stripe-Signature');
        if ($sig) {
            $headers['stripe-signature'] = $sig;
        }

        $result = $this->useCase->handle($payload, $headers);

        return response()->json($result, 200);
    }
}

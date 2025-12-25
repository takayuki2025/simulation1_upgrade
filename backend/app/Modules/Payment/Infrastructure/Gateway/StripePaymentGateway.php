<?php

namespace App\Modules\Payment\Infrastructure\Gateway;

use App\Modules\Payment\Domain\Enum\PaymentMethod;
use App\Modules\Payment\Domain\Port\PaymentGatewayPort;
use Stripe\PaymentIntent;

final class StripePaymentGateway implements PaymentGatewayPort
{
    public function createPaymentIntent(
        PaymentMethod $method,
        array $payload,
    ): array {
        // PaymentMethod ごとの分岐は既存ロジックに委譲
        $intent = PaymentIntent::create($payload);

        return [
            'payment_intent_id' => $intent->id,
            'client_secret' => $intent->client_secret,
        ];
    }
}

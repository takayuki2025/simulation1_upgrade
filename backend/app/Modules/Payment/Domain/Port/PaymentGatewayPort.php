<?php

namespace App\Modules\Payment\Domain\Port;

use App\Modules\Payment\Domain\Enum\PaymentMethod;

interface PaymentGatewayPort
{
    /**
     * Start a payment and return gateway result.
     * CARD: create Stripe PaymentIntent
     * KONBINI: dummy response (v1)
     */
    public function start(
        PaymentMethod $method,
        int $amount,
        string $currency,
        array $context
    ): array;

    /**
     * Verify and parse a webhook payload (Stripe signature verification).
     * Return normalized array:
     *  - provider_event_id
     *  - event_type
     *  - provider_payment_id (e.g. payment_intent id)
     *  - status (succeeded/failed/requires_action/...)
     *  - raw (optional)
     */
    public function parseWebhook(string $payload, array $headers): array;
}

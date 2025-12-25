<?php

namespace Tests\Mocks;

use App\Modules\Payment\Domain\Enum\PaymentMethod;
use App\Modules\Payment\Domain\Port\PaymentGatewayPort;

final class FakePaymentGateway implements PaymentGatewayPort
{
    public array $receivedPayload = [];

    /**
     * Redirect / オフライン決済用（今回は未使用）
     */
    public function start(
        PaymentMethod $method,
        int $amount,
        string $currency,
        array $context
    ): array {
        return [
            'type' => 'redirect',
            'redirect_url' => 'https://example.test/redirect',
            'method' => $method->value,
            'amount' => $amount,
            'currency' => $currency,
            'context' => $context,
        ];
    }

    /**
     * PaymentIntent（今回のテスト対象）
     */
    public function createPaymentIntent(
        PaymentMethod $method,
        array $payload
    ): array {
        $this->receivedPayload = $payload;

        return [
            'payment_intent_id' => 'pi_test_123',
            'client_secret' => 'secret_test_123',
        ];
    }

    /**
     * Webhook 解析（今回は未使用）
     */
    public function parseWebhook(
        string $payload,
        string $signature
    ): array {
        return [
            'event_id' => 'evt_test_123',
            'type' => 'payment_intent.succeeded',
            'raw_payload' => $payload,
            'signature' => $signature,
        ];
    }
}

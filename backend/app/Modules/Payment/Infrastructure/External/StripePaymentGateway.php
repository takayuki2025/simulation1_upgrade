<?php

namespace App\Modules\Payment\Infrastructure\External;

use App\Modules\Payment\Domain\Enum\PaymentMethod;
use App\Modules\Payment\Domain\Port\PaymentGatewayPort;
use Stripe\StripeClient;
use Stripe\Webhook;

final class StripePaymentGateway implements PaymentGatewayPort
{
    private StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient([
            'api_key' => config('services.stripe.secret'),
            'stripe_version' => config('services.stripe.api_version'),
        ]);
    }

    public function start(PaymentMethod $method, int $amount, string $currency, array $context): array
    {
        if ($method === PaymentMethod::CARD) {
            // v1: PaymentIntent を作る（client_secret を返す）
            // context expects: order_id, user_id, shop_id, payment_id
            $pi = $this->stripe->paymentIntents->create([
                'amount' => $amount,
                'currency' => strtolower($currency),
                'automatic_payment_methods' => ['enabled' => true],
                'metadata' => [
                    'order_id' => (string)($context['order_id'] ?? ''),
                    'payment_id' => (string)($context['payment_id'] ?? ''),
                    'user_id' => (string)($context['user_id'] ?? ''),
                    'shop_id' => (string)($context['shop_id'] ?? ''),
                ],
            ]);

            return [
                'provider_payment_id' => $pi->id,
                'client_secret' => $pi->client_secret,
                'requires_action' => ($pi->status === 'requires_action'),
                'status' => $pi->status,
            ];
        }

        // KONBINI: 今回はダミー（状態とDTOだけ整備）
        if ($method === PaymentMethod::KONBINI) {
            $ref = 'KONBINI-DUMMY-' . bin2hex(random_bytes(6));
            return [
                'provider_payment_id' => null,
                'client_secret' => null,
                'requires_action' => true,
                'status' => 'requires_action',
                'instructions' => [
                    'type' => 'konbini',
                    'reference' => $ref,
                    'expires_at' => now()->addDay()->toISOString(),
                    'payload' => null, // future: QR/barcode/base64
                ],
            ];
        }

        throw new \InvalidArgumentException('Unsupported method');
    }

    public function parseWebhook(string $payload, array $headers): array
    {
        $secret = config('services.stripe.webhook_secret');
        $sig = $headers['stripe-signature'] ?? $headers['Stripe-Signature'] ?? null;

        if (! $sig) {
            throw new \RuntimeException('Stripe-Signature header missing');
        }

        $event = Webhook::constructEvent($payload, $sig, $secret);

        $eventId = $event->id;
        $eventType = $event->type;

        // We mostly care about payment_intent.*
        $obj = $event->data->object;
        $providerPaymentId = $obj->id ?? null;

        $normalizedStatus = null;
        if (isset($obj->status)) {
            // succeeded, requires_action, requires_payment_method, canceled, processing...
            $normalizedStatus = (string)$obj->status;
        }

        return [
            'provider_event_id' => $eventId,
            'event_type' => $eventType,
            'provider_payment_id' => $providerPaymentId,
            'status' => $normalizedStatus,
        ];
    }
}

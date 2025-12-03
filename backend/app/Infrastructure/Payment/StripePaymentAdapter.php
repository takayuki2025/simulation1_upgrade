<?php

namespace App\Infrastructure\Payment;


use App\Domain\Port\StripePaymentPort;
use Stripe\StripeClient;

use Illuminate\Support\Facades\Log;


use App\Domain\Service\PaymentPort;
use Stripe\Stripe;
use Stripe\Checkout\Session;



class StripePaymentAdapter implements StripePaymentPort
{
    private StripeClient $client;

    public function __construct()
    {
        $secret = config('services.stripe.secret') ?? env('STRIPE_SECRET');
        if (!$secret) {
            throw new \RuntimeException('Stripe secret key missing.');
        }

        $this->client = new StripeClient($secret);
    }

    public function createCheckoutSession(
        int $userId,
        int $amount,
        string $currency,
        string $itemName,
        string $successUrl,
        string $cancelUrl
    ): string {
        try {
            $session = $this->client->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => $currency,
                        'product_data' => ['name' => $itemName],
                        'unit_amount' => $amount,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'client_reference_id' => (string)$userId,
                'success_url' => $successUrl,
                'cancel_url'  => $cancelUrl,
            ]);

            return $session->url;
        } catch (\Throwable $e) {
            Log::error('StripePaymentAdapter Error', ['msg' => $e->getMessage()]);
            throw new \RuntimeException('Failed to create Stripe session.', 0, $e);
        }
    }
}

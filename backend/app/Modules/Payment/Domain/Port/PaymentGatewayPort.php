<?php

namespace App\Modules\Payment\Domain\Port;

use App\Modules\Payment\Domain\Enum\PaymentMethod;

interface PaymentGatewayPort
{
    public function start(
        PaymentMethod $method,
        int $amount,
        string $currency,
        array $context
    ): array;

    public function parseWebhook(string $payload, string $signature): array;
}

<?php

namespace App\Domain\Port;

interface StripePaymentPort
{
    public function createCheckoutSession(array $data): string;
}

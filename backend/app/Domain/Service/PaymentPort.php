<?php

namespace App\Domain\Service;

interface PaymentPort
{
    public function createCheckoutSession(array $params): array;
}

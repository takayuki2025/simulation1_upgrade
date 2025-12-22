<?php

namespace App\Modules\Payment\Domain\Repository;

interface PaymentQueryRepository
{
    /**
     * Idempotency table: returns true if newly marked, false if already processed.
     */
    public function markWebhookProcessed(string $provider, string $eventId, string $eventType, string $payloadHash): bool;
}

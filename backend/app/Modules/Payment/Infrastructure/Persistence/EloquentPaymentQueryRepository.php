<?php

namespace App\Modules\Payment\Infrastructure\Persistence;

use App\Modules\Payment\Domain\Repository\PaymentQueryRepository;
use Illuminate\Support\Facades\DB;

final class EloquentPaymentQueryRepository implements PaymentQueryRepository
{
    public function markWebhookProcessed(string $provider, string $eventId, string $eventType, string $payloadHash): bool
    {
        try {
            DB::table('processed_webhook_events')->insert([
                'provider' => $provider,
                'event_id' => $eventId,
                'event_type' => $eventType,
                'payload_hash' => $payloadHash,
                'processed_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return true;
        } catch (\Throwable $e) {
            // unique violation => already processed
            return false;
        }
    }
}

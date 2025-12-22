<?php

namespace App\Modules\Payment\Infrastructure\Persistence;

use App\Modules\Payment\Domain\Repository\PaymentQueryRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

final class EloquentPaymentQueryRepository implements PaymentQueryRepository
{
    public function reserve(
        string $provider,
        string $eventId,
        string $eventType,
        string $payloadHash
    ): bool {
        try {
            DB::table('processed_webhook_events')->insert([
                'provider' => $provider,
                'event_id' => $eventId,
                'event_type' => $eventType,
                'payload_hash' => $payloadHash,
                'status' => 'reserved',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return true;
        } catch (QueryException $e) {
            // UNIQUE(provider, event_id) violation → idempotent hit
            return false;
        }
    }

    public function complete(
        string $provider,
        string $eventId,
        string $status,
        ?int $paymentId = null,
        ?int $orderId = null,
        // ?string $reason = null,
        ?string $errorMessage = null,
    ): void {
        DB::table('processed_webhook_events')
            ->where('provider', $provider)
            ->where('event_id', $eventId)
            ->update([
                'status' => $status,
                'payment_id' => $paymentId,
                'order_id' => $orderId,
                // 'reason' => $reason,
                'error_message' => $errorMessage,
                'updated_at' => now(),
            ]);
    }
}

<?php

namespace App\Modules\Payment\Application\UseCase;

use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Order\Domain\Enum\OrderStatus;
use App\Modules\Payment\Domain\Repository\PaymentRepository;
use App\Modules\Payment\Domain\Repository\PaymentQueryRepository;
use App\Modules\Payment\Domain\Enum\PaymentStatus;
use App\Modules\Payment\Domain\Port\PaymentGatewayPort;
use Illuminate\Support\Facades\DB;

final class HandlePaymentWebhookUseCase
{
    public function __construct(
        private PaymentGatewayPort $gateway,
        private PaymentQueryRepository $queries,
        private PaymentRepository $payments,
        private OrderRepository $orders,
    ) {
    }

    public function handle(string $payload, array $headers): array
    {
        $payloadHash = hash('sha256', $payload);

        $parsed = $this->gateway->parseWebhook($payload, $headers);

        $eventId = $parsed['provider_event_id'];
        $eventType = $parsed['event_type'];
        $providerPaymentId = $parsed['provider_payment_id'] ?? null;

        // 1) Idempotency
        $marked = $this->queries->markWebhookProcessed('stripe', $eventId, $eventType, $payloadHash);
        if (! $marked) {
            return ['ok' => true, 'idempotent' => true];
        }

        // 2) Find payment by provider_payment_id
        if (! $providerPaymentId) {
            return ['ok' => true, 'ignored' => 'no_provider_payment_id'];
        }

        $payment = $this->payments->findByProviderPaymentId($providerPaymentId);
        if (! $payment) {
            return ['ok' => true, 'ignored' => 'payment_not_found'];
        }

        // 3) Decide status mapping
        $status = $parsed['status'] ?? null;

        return DB::transaction(function () use ($payment, $status, $parsed) {

            // Stripe status -> internal
            if ($status === 'succeeded') {
                $this->payments->updateStatusById($payment->id() ?? 0, PaymentStatus::SUCCEEDED->value, [
                    'webhook' => $parsed,
                ]);

                // update Order
                $this->orders->updateStatus($payment->orderId(), OrderStatus::PAID->value);

                return ['ok' => true, 'status' => 'succeeded'];
            }

            if ($status === 'requires_action' || $status === 'processing') {
                $this->payments->updateStatusById($payment->id() ?? 0, PaymentStatus::REQUIRES_ACTION->value, [
                    'webhook' => $parsed,
                ]);
                return ['ok' => true, 'status' => 'requires_action'];
            }

            if ($status === 'canceled' || $status === 'requires_payment_method') {
                $this->payments->updateStatusById($payment->id() ?? 0, PaymentStatus::FAILED->value, [
                    'webhook' => $parsed,
                ]);
                $this->orders->updateStatus($payment->orderId(), OrderStatus::PAYMENT_FAILED->value);

                return ['ok' => true, 'status' => 'failed'];
            }

            return ['ok' => true, 'status' => 'ignored_unknown'];
        });
    }
}

<?php

namespace App\Modules\Payment\Application\UseCase;

use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Order\Domain\Enum\OrderStatus;
use App\Modules\Payment\Domain\Repository\PaymentRepository;
use App\Modules\Payment\Domain\Repository\PaymentQueryRepository;
use App\Modules\Payment\Domain\Port\PaymentGatewayPort;
use App\Modules\Shop\Domain\Repository\ShopLedgerRepository;
use App\Modules\Shop\Domain\Entity\ShopLedger;
use Illuminate\Support\Facades\DB;

final class HandlePaymentWebhookUseCase
{
    public function __construct(
        private PaymentGatewayPort $gateway,
        private PaymentQueryRepository $queries,
        private PaymentRepository $payments,
        private OrderRepository $orders,
        private ShopLedgerRepository $ledgers,
    ) {
    }

    public function handle(string $payload, string $signature): array
    {
        $payloadHash = hash('sha256', $payload);

        // 1) Parse & verify signature
        $parsed = $this->gateway->parseWebhook($payload, $signature);

        $eventId   = $parsed['provider_event_id'];
        $eventType = $parsed['event_type'];

        // 2) 対象イベント制限（超重要）
        if (!str_starts_with($eventType, 'payment_intent.')) {
            return ['ok' => true, 'ignored' => 'unsupported_event_type'];
        }

        // 3) Reserve (idempotency)
        $reserved = $this->queries->reserve(
            'stripe',
            $eventId,
            $eventType,
            $payloadHash
        );

        if (!$reserved) {
            return ['ok' => true, 'idempotent' => true];
        }

        try {
            return DB::transaction(function () use ($parsed, $eventId) {

                $providerPaymentId = $parsed['provider_payment_id'];
                if (!$providerPaymentId) {
                    $this->queries->complete('stripe', $eventId, 'ignored');
                    return ['ok' => true, 'ignored' => 'no_payment_id'];
                }

                $payment = $this->payments->findByProviderPaymentId($providerPaymentId);
                if (!$payment) {
                    $this->queries->complete('stripe', $eventId, 'ignored');
                    return ['ok' => true, 'ignored' => 'payment_not_found'];
                }

                $order = $this->orders->findById($payment->orderId());
                if (!$order) {
                    $this->queries->complete('stripe', $eventId, 'failed', $payment->id(), null, 'order_not_found');
                    return ['ok' => false];
                }

                // 4) 状態分岐
                switch ($parsed['status']) {
                    case 'succeeded':
                        $payment = $payment->markSucceeded(['webhook' => $parsed]);
                        $this->payments->save($payment);

                        $order = $order->markPaid();
                        $this->orders->save($order);

                        // Ledger 追加（売上確定）
                        $this->ledgers->save(
                            ShopLedger::record(
                                shopId: $payment->shopId(),
                                type: 'sale',
                                amount: $payment->amount(),
                                currency: $payment->currency(),
                                orderId: $order->id(),
                                paymentId: $payment->id(),
                            )
                        );

                        $this->queries->complete(
                            'stripe',
                            $eventId,
                            'succeeded',
                            $payment->id(),
                            $order->id()
                        );

                        return ['ok' => true, 'status' => 'succeeded'];

                    case 'payment_failed':
                    case 'canceled':
                        $payment = $payment->markFailed(['webhook' => $parsed]);
                        $this->payments->save($payment);

                        $order = $order->markPaymentFailed();
                        $this->orders->save($order);

                        $this->queries->complete(
                            'stripe',
                            $eventId,
                            'failed',
                            $payment->id(),
                            $order->id()
                        );

                        return ['ok' => true, 'status' => 'failed'];

                    default:
                        $this->queries->complete(
                            'stripe',
                            $eventId,
                            'ignored',
                            $payment->id(),
                            $order->id()
                        );
                        return ['ok' => true, 'status' => 'ignored'];
                }
            });

        } catch (\Throwable $e) {
            $this->queries->complete(
                'stripe',
                $eventId,
                'failed',
                null,
                null,
                'exception',
                $e->getMessage()
            );
            throw $e;
        }
    }
}

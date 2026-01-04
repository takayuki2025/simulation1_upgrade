<?php

namespace App\Modules\Payment\Application\UseCase;

use App\Modules\Payment\Application\Dto\HandlePaymentWebhookInput;
use App\Modules\Payment\Domain\Enum\PaymentStatus;
use App\Modules\Payment\Domain\Event\DomainPaymentEventType;
use App\Modules\Payment\Domain\Repository\PaymentQueryRepository;
use App\Modules\Payment\Domain\Repository\PaymentRepository;
use App\Modules\Payment\Domain\Service\StripeEventMapper;
use App\Modules\Order\Domain\Event\OrderPaid;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Shop\Domain\Repository\ShopLedgerRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;

final class HandlePaymentWebhookUseCase
{
    public function __construct(
        private PaymentQueryRepository $webhookEvents,
        private PaymentRepository $payments,
        private OrderRepository $orders,
        private ShopLedgerRepository $ledgers,
        private StripeEventMapper $mapper,
    ) {
    }

    public function handle(HandlePaymentWebhookInput $input): void
    {


        \Log::info('[🔥Webhook] handle called', [
            'provider' => $input->provider,
            'event_id' => $input->eventId,
            'event_type' => $input->eventType,
        ]);

        if ($this->safeReserve($input) !== true) {
            return;
        }

        $paymentId = null;
        $orderId   = null;
        $orderPaidEvent = null;

        try {
            $domainEvent = $this->mapper->map($input);


            \Log::info('[🔥Webhook] mapped domain event', [
                'type' => $domainEvent->type->value,
                'provider_payment_id' => $domainEvent->providerPaymentId,
            ]);


            if ($domainEvent->type === DomainPaymentEventType::IGNORED) {
                return;
            }

            DB::transaction(function () use (
                $domainEvent,
                &$paymentId,
                &$orderId,
                &$orderPaidEvent
            ) {
                $payment = $this->payments
                    ->findByProviderPaymentId($domainEvent->providerPaymentId);

                if (!$payment) {
                    return;
                }

                // ----------------------------
                // Refund（ここが追加点）
                // ----------------------------
                if ($domainEvent->type === DomainPaymentEventType::REFUND_SUCCEEDED) {

                    $meta = $domainEvent->instructions ?? [];
                    $refundId = $meta['provider_refund_id'] ?? null;

                    if (!is_string($refundId)) {
                        return;
                    }

                    if ($this->ledgers->existsRefundByProviderRefundId('stripe', $refundId)) {
                        return; // 冪等
                    }

                    $this->ledgers->recordRefund(
                        shopId: $payment->shopId(),
                        amount: $payment->amount(),
                        currency: $payment->currency(),
                        orderId: $payment->orderId(),
                        paymentId: $payment->id(),
                        provider: 'stripe',
                        providerRefundId: $refundId,
                        reason: $meta['reason'] ?? null,
                        occurredAt: $domainEvent->occurredAt,
                    );

                    return;
                }

                // ----------------------------
                // 通常の決済フロー
                // ----------------------------
                if ($payment->status() === PaymentStatus::SUCCEEDED) {
                    return;
                }

                if ($domainEvent->type === DomainPaymentEventType::FAILED) {
                    $this->payments->save(
                        $payment->markFailed(['reason' => $domainEvent->reason])
                    );
                    return;
                }

                if ($domainEvent->type === DomainPaymentEventType::REQUIRES_ACTION) {
                    $this->payments->save(
                        $payment->markRequiresAction()
                    );
                    return;
                }


                if ($domainEvent->type === DomainPaymentEventType::SUCCEEDED) {

                    // ✅ ① Order を先に取得
                    $order = $this->orders->findById($payment->orderId());
                    if (! $order) {
                        return;
                    }

                    // ✅ ② すでに Paid なら何もしない（最重要）
                    if ($order->isPaid()) {
                        return;
                    }

                    // ✅ ③ Payment を SUCCEEDED に
                    $payment = $payment->markSucceeded();
                    $this->payments->save($payment);

                    // ✅ ④ Order を Paid に
                    $paidOrder = $order->markPaid();
                    $this->orders->save($paidOrder);

                    // ✅ ⑤ Domain Event はここで1回だけ
                    $orderPaidEvent = new OrderPaid(
                        orderId: $paidOrder->id(),
                        shopId: $paidOrder->shopId(),
                    );

                    // ✅ ⑥ Ledger 記録
                    $this->ledgers->recordSale(
                        shopId: $payment->shopId(),
                        amount: $payment->amount(),
                        currency: $payment->currency(),
                        orderId: $payment->orderId(),
                        paymentId: $payment->id(),
                        occurredAt: $domainEvent->occurredAt,
                    );
                }

            });


            if ($orderPaidEvent) {

                \Log::info('[🔥Webhook] dispatching OrderPaid (afterCommit)', [
                    'order_id' => $orderPaidEvent->orderId,
                ]);

                DB::afterCommit(fn () => Event::dispatch($orderPaidEvent));
            }


        } finally {
            $this->safeComplete($input, 'ok', $paymentId, $orderId, null);
        }
    }

    private function safeReserve(HandlePaymentWebhookInput $input): bool|null
    {
        try {
            return $this->webhookEvents->reserve(
                $input->provider,
                $input->eventId,
                $input->eventType,
                $input->payloadHash
            );
        } catch (\Throwable) {
            return null;
        }
    }

    private function safeComplete(
        HandlePaymentWebhookInput $input,
        string $status,
        ?int $paymentId,
        ?int $orderId,
        ?string $errorMessage,
    ): void {
        try {
            $this->webhookEvents->complete(
                $input->provider,
                $input->eventId,
                $status,
                $paymentId,
                $orderId,
                $errorMessage,
            );
        } catch (\Throwable) {
        }
    }
}

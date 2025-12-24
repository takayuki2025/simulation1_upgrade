<?php

namespace App\Modules\Payment\Application\UseCase;

use App\Modules\Payment\Application\Dto\HandlePaymentWebhookInput;
use App\Modules\Payment\Domain\Repository\PaymentRepository;
use App\Modules\Payment\Domain\Repository\PaymentQueryRepository;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Shop\Domain\Repository\ShopLedgerRepository;
use App\Modules\Payment\Domain\Enum\PaymentStatus;
use App\Modules\Payment\Domain\Event\DomainPaymentEventType;
use App\Modules\Payment\Domain\Service\StripeEventMapper;
use App\Modules\Payment\Domain\Enum\PaymentMethod;
use Illuminate\Support\Facades\DB;

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
        \Log::info('[Webhook Received]', [
            'event_id'   => $input->eventId,
            'event_type' => $input->eventType,
        ]);

        $paymentId = null;
        $orderId   = null;

        /* ============================================
           ① 冪等ロック（Webhook は常に 200）
        ============================================ */
        $reserved = $this->safeReserve($input);

        if ($reserved === false) {
            \Log::info('[Webhook Skipped Already Reserved]', [
                'event_id' => $input->eventId,
            ]);
            return;
        }

        if ($reserved === null) {
            \Log::error('[Webhook Reserve Failed - Swallowed]', [
                'event_id' => $input->eventId,
            ]);
            return;
        }

        try {
            /* ============================================
               ② Stripe Event → Domain Event
            ============================================ */
            $domainEvent = $this->mapper->map($input);

            \Log::info('[Domain Event Mapped]', [
                'event_type' => $domainEvent->type->value,
                'provider_payment_id' => $domainEvent->providerPaymentId,
            ]);

            if ($domainEvent->type === DomainPaymentEventType::IGNORED) {
                $this->safeComplete($input, 'ignored', null, null, null);
                return;
            }

            if (empty($domainEvent->providerPaymentId)) {
                $this->safeComplete($input, 'missing_provider_payment_id', null, null, null);
                return;
            }

            /* ============================================
               ③ Domain 更新（トランザクション）
            ============================================ */
            DB::transaction(function () use ($input, $domainEvent, &$paymentId, &$orderId) {

                $payment = $this->payments
                    ->findByProviderPaymentId($domainEvent->providerPaymentId);

                if (! $payment) {
                    \Log::warning('[Webhook Payment Not Found]', [
                        'provider_payment_id' => $domainEvent->providerPaymentId,
                    ]);
                    return;
                }

                // ★ SUCCEEDED 以降は上書き禁止
                if ($payment->status() === PaymentStatus::SUCCEEDED) {
                    \Log::info('[Webhook Payment Already Succeeded]', [
                        'payment_id' => $payment->id(),
                    ]);
                    $paymentId = $payment->id();
                    $orderId   = $payment->orderId();
                    return;
                }

                /* ============================================
                   SUCCEEDED
                ============================================ */
                if ($domainEvent->type === DomainPaymentEventType::SUCCEEDED) {

                    \Log::info('[Webhook SUCCEEDED ENTER]', [
                        'payment_id' => $payment->id(),
                        'before_status' => $payment->status()->value,
                    ]);

                    $methodDetails = $payment->methodDetails();
                    if (!is_array($methodDetails)) {
                        $methodDetails = [];
                    }

                    if (
                        $payment->method() === PaymentMethod::CARD
                        && empty($methodDetails['receipt_number'])
                    ) {
                        $methodDetails['receipt_number']
                            = $domainEvent->providerPaymentId;
                    }

                    $payment = $payment
                        ->markSucceeded([
                            'occurred_at' => $domainEvent->occurredAt->format(DATE_ATOM),
                        ])
                        ->withMethodDetails($methodDetails);

                    \Log::info('[Webhook SUCCEEDED AFTER]', [
                        'after_status' => $payment->status()->value,
                        'method_details' => $payment->methodDetails(),
                    ]);
                }

                /* ============================================
                   FAILED
                ============================================ */ elseif ($domainEvent->type === DomainPaymentEventType::FAILED) {

                    $payment = $payment->markFailed([
                        'reason' => $domainEvent->reason,
                    ]);
                }

                /* ============================================
                   REQUIRES_ACTION
                ============================================ */ elseif ($domainEvent->type === DomainPaymentEventType::REQUIRES_ACTION) {

                    $payment = $payment->markRequiresAction();
                }

                /* ============================================
                   永続化
                ============================================ */
                $this->payments->save($payment);

                \Log::info('[Payment Saved]', [
                    'payment_id' => $payment->id(),
                    'status' => $payment->status()->value,
                    'method_details' => $payment->methodDetails(),
                ]);

                $paymentId = $payment->id();
                $orderId   = $payment->orderId();

                /* ============================================
                   Order / Ledger
                ============================================ */
                if ($payment->status() === PaymentStatus::SUCCEEDED) {

                    $order = $this->orders->findById($payment->orderId());
                    if ($order) {
                        $this->orders->save($order->markPaid());
                    }

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

            /* ============================================
               ④ 完了記録
            ============================================ */
            if ($paymentId === null) {
                $this->safeComplete($input, 'payment_not_found', null, null, null);
                return;
            }

            $this->safeComplete(
                $input,
                'succeeded',
                $paymentId,
                $orderId,
                null
            );

            \Log::info('[Webhook Completed]', [
                'event_id' => $input->eventId,
                'payment_id' => $paymentId,
            ]);

        } catch (\Throwable $e) {

            $this->safeComplete(
                $input,
                'failed',
                $paymentId,
                $orderId,
                $e->getMessage()
            );

            \Log::error('[Webhook Exception - Swallowed]', [
                'event_id' => $input->eventId,
                'message' => $e->getMessage(),
            ]);

            return;
        }
    }

    /* ============================================================
       Safe Helpers
    ============================================================ */

    private function safeReserve(HandlePaymentWebhookInput $input): bool|null
    {
        try {
            return $this->webhookEvents->reserve(
                $input->provider,
                $input->eventId,
                $input->eventType,
                $input->payloadHash
            );
        } catch (\Throwable $e) {
            \Log::error('[Webhook Reserve Failed]', [
                'event_id' => $input->eventId,
                'message' => $e->getMessage(),
            ]);
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
        } catch (\Throwable $e) {
            \Log::error('[Webhook Complete Failed]', [
                'event_id' => $input->eventId,
                'status' => $status,
                'message' => $e->getMessage(),
            ]);
        }
    }
}

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
        \Log::info('[Webhook Received]', [
            'event_id'   => $input->eventId,
            'event_type' => $input->eventType,
        ]);

        $paymentId = null;
        $orderId   = null;

        // reserve できない（or 例外）なら即 return（Stripe には 2xx を返す想定でも、ここは処理を終える）
        if ($this->safeReserve($input) !== true) {
            return;
        }

        // dispatch はトランザクション外で行うため、イベントを一時保持
        $orderPaidEvent = null;

        try {
            $domainEvent = $this->mapper->map($input);




            \Log::info('[DEBUG] mapped domain event', [
                'event_id' => $input->eventId,
                'event_type' => $input->eventType,
                'mapped_type' => $domainEvent->type->value ?? (string)$domainEvent->type,
                'provider_payment_id' => $domainEvent->providerPaymentId ?? null,
            ]);


            if ($domainEvent->type === DomainPaymentEventType::IGNORED) {
                $this->safeComplete($input, 'ignored', null, null, null);
                return;
            }

            if (empty($domainEvent->providerPaymentId)) {
                $this->safeComplete($input, 'missing_provider_payment_id', null, null, null);
                return;
            }

            DB::transaction(function () use ($domainEvent, &$paymentId, &$orderId, &$orderPaidEvent) {

                $payment = $this->payments
                    ->findByProviderPaymentId($domainEvent->providerPaymentId);

                if (! $payment) {




                    \Log::warning('[DEBUG] payment not found by provider_payment_id', [
                        'provider_payment_id' => $domainEvent->providerPaymentId,
                        'event_type' => $input->eventType,
                        'event_id' => $input->eventId,
                    ]);

                    // Webhook は 500 を返さない方針：ここでは例外にしない
                    // ただし complete 側では paymentId/orderId は null のままになる
                    return;
                }

                // ---- 例外的救済：instructions が未保存なら埋めてよい（null のときだけ）----
                if (
                    $payment->instructions() === null
                    && property_exists($domainEvent, 'instructions')
                    && ! empty($domainEvent->instructions)
                ) {
                    $payment = $payment->withInstructions($domainEvent->instructions);
                }

                // ---- SUCCEEDED の冪等：すでに SUCCEEDED なら status は触らない（上書きしない）----
                if ($payment->status() === PaymentStatus::SUCCEEDED) {
                    $paymentId = $payment->id();
                    $orderId   = $payment->orderId();

                    // instructions 救済で変更があった可能性があるので save
                    $this->payments->save($payment);
                    return;
                }

                // ---- イベント種別ごとの status 遷移 ----
                if ($domainEvent->type === DomainPaymentEventType::REQUIRES_ACTION) {

                    // instructions を最優先で保存
                    if (property_exists($domainEvent, 'instructions') && ! empty($domainEvent->instructions)) {
                        $payment = $payment->withInstructions($domainEvent->instructions);
                    }

                    $payment = $payment->markRequiresAction([
                        'occurred_at' => $domainEvent->occurredAt->format(DATE_ATOM),
                    ]);

                    $this->payments->save($payment);
                }

                if ($domainEvent->type === DomainPaymentEventType::FAILED) {
                    $payment = $payment->markFailed([
                        'occurred_at' => $domainEvent->occurredAt->format(DATE_ATOM),
                        'reason'      => $domainEvent->reason ?? null,
                    ]);

                    $this->payments->save($payment);
                }

                if ($domainEvent->type === DomainPaymentEventType::SUCCEEDED) {

                    // ① Payment を SUCCEEDED に
                    $payment = $payment->markSucceeded([
                        'occurred_at' => $domainEvent->occurredAt->format(DATE_ATOM),
                    ]);
                    $this->payments->save($payment);

                    // ② Order を PAID に（Order Aggregate が唯一の情報源）
                    $order = $this->orders->findById($payment->orderId());
                    if ($order) {
                        $paidOrder = $order->markPaid();
                        $this->orders->save($paidOrder);

                        // ✅ dispatch は transaction 外で行う（ここでは Event オブジェクトだけ作る）
                        // ✅ orderId / shopId を必ず載せる（Listener を強くする）
                        $orderPaidEvent = new OrderPaid(
                            orderId: $paidOrder->id(),
                            shopId: $paidOrder->shopId(),
                        );
                    }

                    // ③ 売上計上（Ledger）
                    $this->ledgers->recordSale(
                        shopId: $payment->shopId(),
                        amount: $payment->amount(),
                        currency: $payment->currency(),
                        orderId: $payment->orderId(),
                        paymentId: $payment->id(),
                        occurredAt: $domainEvent->occurredAt,
                    );
                }

                $paymentId = $payment->id();
                $orderId   = $payment->orderId();
            });

            // ✅ トランザクション外で dispatch（コミット済みの状態を前提に Listener が動ける）
            if ($orderPaidEvent !== null) {
                Event::dispatch($orderPaidEvent);
            }

            $this->safeComplete($input, 'ok', $paymentId, $orderId, null);

        } catch (\Throwable $e) {

            $this->safeComplete(
                $input,
                'failed',
                $paymentId,
                $orderId,
                $e->getMessage()
            );

            \Log::error('[Webhook Exception]', [
                'event_id' => $input->eventId,
                'message'  => $e->getMessage(),
            ]);
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
        } catch (\Throwable $e) {
            \Log::error('[Webhook Reserve Failed]', [
                'event_id' => $input->eventId,
                'message'  => $e->getMessage(),
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
                'status'   => $status,
                'message'  => $e->getMessage(),
            ]);
        }
    }
}

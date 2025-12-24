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
        DB::transaction(function () use ($input) {

            /* ============================================
               ① 冪等ロック
            ============================================ */
            if (! $this->webhookEvents->reserve(
                $input->provider,
                $input->eventId,
                $input->eventType,
                $input->payloadHash
            )) {
                return;
            }

            try {
                /* ============================================
                   ② Stripe → Domain Event
                ============================================ */
                $event = $this->mapper->map($input);

                /* ============================================
                   ③ Payment 取得
                ============================================ */
                $payment = $this->payments
                    ->findByProviderPaymentId($event->providerPaymentId);

                if (! $payment) {
                    throw new \RuntimeException('Payment not found');
                }

                /* ============================================
                   ④ Payment 状態遷移
                ============================================ */
                $payment = match ($event->type) {
                    DomainPaymentEventType::SUCCEEDED =>
                        $payment->markSucceeded([
                            'occurred_at' => $event->occurredAt->format(DATE_ATOM),
                        ]),

                    DomainPaymentEventType::FAILED =>
                        $payment->markFailed([
                            'reason' => $event->reason,
                        ]),

                    DomainPaymentEventType::REQUIRES_ACTION =>
                        $payment->markRequiresAction(),

                    default => $payment,
                };

                $this->payments->save($payment);

                /* ============================================
                   ⑤ Order / Ledger 同期
                ============================================ */
                if ($payment->status() === PaymentStatus::SUCCEEDED) {

                    $order = $this->orders->findById($payment->orderId());
                    $this->orders->save($order->markPaid());

                    $this->ledgers->recordSale(
                        shopId: $payment->shopId(),
                        amount: $payment->amount(),
                        currency: $payment->currency(),
                        orderId: $payment->orderId(),
                        paymentId: $payment->id(),
                        occurredAt: $event->occurredAt,
                    );
                }

                /* ============================================
                   ⑥ Webhook 完了
                ============================================ */
                $this->webhookEvents->complete(
                    $input->provider,
                    $input->eventId,
                    'succeeded',
                    $payment->id(),
                    $payment->orderId(),
                );

            } catch (\Throwable $e) {

                /* ============================================
                   ⑦ 失敗記録（再実行可能）
                ============================================ */
                $this->webhookEvents->complete(
                    $input->provider,
                    $input->eventId,
                    'failed',
                    null,                // paymentId
                    null,                // orderId
                    'exception',         // errorType
                    $e->getMessage(),    // errorMessage
                );

                throw $e;
            }
        });
    }
}

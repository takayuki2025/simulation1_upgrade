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
use App\Modules\Order\Domain\Event\OrderPaid;
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

        if ($this->safeReserve($input) !== true) {
            return;
        }

        // ✅ dispatch はトランザクション外で実行するため、一時保持（局所変数）
        $orderPaidEvent = null;

        try {
            $domainEvent = $this->mapper->map($input);

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
                    // Webhook は常に 200 で返す想定なので、ここでは例外にしない
                    return;
                }

                // ---- 例外的救済：instructions が未保存なら埋めてよい（null のときだけ）----
                if (
                    $payment->instructions() === null
                    && property_exists($domainEvent, 'instructions')
                    && !empty($domainEvent->instructions)
                ) {
                    $payment = $payment->withInstructions($domainEvent->instructions);
                }

                // ---- status 遷移 ----
                // SUCCEEDED の冪等：すでに SUCCEEDED なら status は触らない（上書きしない）
                if ($payment->status() === PaymentStatus::SUCCEEDED) {
                    $paymentId = $payment->id();
                    $orderId   = $payment->orderId();

                    // instructions 救済で変更があった可能性があるので save
                    $this->payments->save($payment);
                    return;
                }

                if ($domainEvent->type === DomainPaymentEventType::REQUIRES_ACTION) {
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

                    $payment = $payment->markSucceeded([
                        'occurred_at' => $domainEvent->occurredAt->format(DATE_ATOM),
                    ]);

                    $this->payments->save($payment);

                    $order = $this->orders->findById($payment->orderId());
                    if ($order) {
                        $paidOrder = $order->markPaid();
                        $this->orders->save($paidOrder);

                        // Shipment 作成は「カード決済のみ」
                        if ($payment->method() === PaymentMethod::CARD) {
                            // ✅ userId は Order Aggregate からのみ取得
                            // ✅ さらに保険で「位置引数」にする（named arg 事故を根絶）
                            $orderPaidEvent = new OrderPaid(
                                $paidOrder->id(),
                                // $paidOrder->shopId(),境界違反
                                // $paidOrder->userId(),
                            );
                        }
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

                $paymentId = $payment->id();
                $orderId   = $payment->orderId();
            });

            // ✅ トランザクション外で dispatch
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

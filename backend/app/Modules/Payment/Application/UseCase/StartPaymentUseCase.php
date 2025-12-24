<?php

namespace App\Modules\Payment\Application\UseCase;

use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Order\Domain\Enum\OrderStatus;
use App\Modules\Payment\Application\Dto\StartPaymentInput;
use App\Modules\Payment\Application\Dto\StartPaymentOutput;
use App\Modules\Payment\Domain\Entity\Payment;
use App\Modules\Payment\Domain\Enum\PaymentMethod;
use App\Modules\Payment\Domain\Enum\PaymentProvider;
use App\Modules\Payment\Domain\Repository\PaymentRepository;
use App\Modules\Payment\Domain\Port\PaymentGatewayPort;
use Illuminate\Support\Facades\DB;

final class StartPaymentUseCase
{
    public function __construct(
        private OrderRepository $orders,
        private PaymentRepository $payments,
        private PaymentGatewayPort $gateway,
    ) {
    }

    public function handle(StartPaymentInput $input, int $userId): StartPaymentOutput
    {
        return DB::transaction(function () use ($input, $userId) {

            /* ============================================
               ① Order 検証
            ============================================ */
            $order = $this->orders->findById($input->orderId);
            if (! $order) {
                throw new \RuntimeException('Order not found');
            }

            if ((int) $order->userId() !== $userId) {
                throw new \DomainException('Forbidden');
            }

            if ($order->status() !== OrderStatus::PENDING_PAYMENT) {
                throw new \DomainException('Order is not payable');
            }

            /* ============================================
               ② Payment 初期作成
            ============================================ */
            $method = PaymentMethod::from($input->method);

            $payment = Payment::initiate(
                orderId: $order->id(),
                shopId: $order->shopId(),
                userId: $order->userId(),
                provider: PaymentProvider::STRIPE,
                method: $method,
                amount: $order->totalAmount(),
                currency: $order->currency(),
                meta: [
                    'order_status' => $order->status()->value,
                ]
            );

            $payment = $this->payments->save($payment);

            /* ============================================
               ③ Gateway 呼び出し
            ============================================ */
            $res = $this->gateway->start(
                method: $method,
                amount: $order->totalAmount(),
                currency: $order->currency(),
                context: [
                    'order_id'   => $order->id(),
                    'payment_id' => $payment->id(),
                    'user_id'    => $order->userId(),
                    'shop_id'    => $order->shopId(),
                    'payer_name' => '購入者-' . $order->userId(),
                ]
            );

            /* ============================================
               ④ provider_payment_id 反映
            ============================================ */
            if (!empty($res['provider_payment_id'])) {
                $payment = $payment->withProviderPayment($res['provider_payment_id']);
            }

            /* ============================================
               ⑤ requires_action 遷移
            ============================================ */
            if (($res['requires_action'] ?? false) === true) {
                $payment = $payment->markRequiresAction([
                    'gateway_status' => $res['status'] ?? null,
                ]);
            }

            /* ============================================
               ⑥ instructions のみ反映（★重要）
            ============================================ */
            if (!empty($res['instructions'])) {
                $payment = $payment->withInstructions($res['instructions']);
            }

            $payment = $this->payments->save($payment);

            /* ============================================
               ⑦ レスポンス
            ============================================ */
            return new StartPaymentOutput(
                paymentId: $payment->id(),
                status: $payment->status()->value,
                providerPaymentId: $payment->providerPaymentId(),
                clientSecret: $res['client_secret'] ?? null,
                instructions: $res['instructions'] ?? null
            );
        });
    }
}

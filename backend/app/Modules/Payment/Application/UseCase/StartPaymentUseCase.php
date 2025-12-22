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

            $order = $this->orders->findById($input->orderId);
            if (! $order) {
                throw new \RuntimeException('Order not found');
            }
            if ((int)$order->userId() !== (int)$userId) {
                throw new \DomainException('Forbidden');
            }
            if ($order->status() !== OrderStatus::PENDING_PAYMENT) {
                throw new \DomainException('Order is not payable');
            }

            $method = PaymentMethod::from($input->method);

            // 1) initiate payment record
            $payment = Payment::initiate(
                orderId: $order->id() ?? 0,
                shopId: $order->shopId(),
                userId: $order->userId(),
                provider: PaymentProvider::STRIPE,
                method: $method,
                amount: $order->totalAmount(),
                currency: $order->currency(),
                meta: ['order_status' => $order->status()->value]
            );

            $payment = $this->payments->save($payment);

            // 2) call gateway
            $res = $this->gateway->start(
                method: $method,
                amount: $order->totalAmount(),
                currency: $order->currency(),
                context: [
                    'order_id' => $order->id(),
                    'payment_id' => $payment->id(),
                    'user_id' => $order->userId(),
                    'shop_id' => $order->shopId(),
                ]
            );

            // 3) update payment with provider ids / instructions
            if (!empty($res['provider_payment_id'])) {
                $payment = $payment->withProviderPayment($res['provider_payment_id']);
            }

            if (($res['requires_action'] ?? false) === true) {
                $payment = $payment->markRequiresAction(['gateway_status' => $res['status'] ?? null]);
            }

            $meta = [
                'gateway_status' => $res['status'] ?? null,
            ];

            $payment = $this->payments->save(
                Payment::reconstitute(
                    id: $payment->id() ?? 0,
                    orderId: $payment->orderId(),
                    shopId: $payment->shopId(),
                    userId: $payment->userId(),
                    provider: $payment->provider(),
                    method: $payment->method(),
                    status: $payment->status(),
                    amount: $payment->amount(),
                    currency: $payment->currency(),
                    providerPaymentId: $payment->providerPaymentId(),
                    providerCustomerId: $payment->providerCustomerId(),
                    methodDetails: $payment->methodDetails(),
                    instructions: $res['instructions'] ?? null,
                    meta: $meta
                )
            );

            return new StartPaymentOutput(
                paymentId: $payment->id() ?? 0,
                status: $payment->status()->value,
                providerPaymentId: $payment->providerPaymentId(),
                clientSecret: $res['client_secret'] ?? null,
                instructions: $res['instructions'] ?? null
            );
        });
    }
}

<?php

namespace App\Modules\Payment\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Payment\Domain\Repository\PaymentRepository;
use Illuminate\Http\Request;

final class PaymentReadController extends Controller
{
    public function latestByOrder(Request $request, PaymentRepository $payments)
    {
        $orderId = (int) $request->query('order_id');
        if (!$orderId) {
            abort(400, 'order_id is required');
        }

        $payment = $payments->findLatestByOrderId($orderId);
        if (!$payment) {
            abort(404);
        }

        return response()->json([
            'payment_id' => $payment->id(),
            'method' => $payment->method()->value,
            'status' => $payment->status()->value,
            'provider_payment_id' => $payment->providerPaymentId(),
            'instructions' => $payment->instructions(),
            'method_details' => $payment->methodDetails(),
        ]);
    }
}

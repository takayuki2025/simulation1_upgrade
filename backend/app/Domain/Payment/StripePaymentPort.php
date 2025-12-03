<?php

namespace App\Domain\Payment;

interface StripePaymentPort
{
    /**
     * Stripe Checkout Session を作成し、その URL を返す
     *
     * @param int $userId             購入ユーザーID（client_reference_id にセット）
     * @param int $amount             支払金額（通貨単位：最小単位。日本円なら「円」でOK）
     * @param string $currency        通貨（例: 'jpy'）
     * @param string $itemName        商品名（Stripe上に表示される）
     * @param string $successUrl      成功時のリダイレクトURL（{CHECKOUT_SESSION_ID} を含んでOK）
     * @param string $cancelUrl       キャンセル時のリダイレクトURL
     * @return string                 Stripe の Checkout ページURL
     *
     * @throws \RuntimeException      Stripe API エラー時など
     */
    public function createCheckoutSession(
        int $userId,
        int $amount,
        string $currency,
        string $itemName,
        string $successUrl,
        string $cancelUrl
    ): string;
}

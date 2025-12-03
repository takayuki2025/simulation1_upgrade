<?php

namespace App\Application\UseCase\Purchase;

use App\Domain\Repository\ItemRepository;
use App\Domain\Repository\OrderHistoryRepository;
use App\Domain\Payment\StripePaymentPort;

class PurchaseUseCase
{
    public function __construct(
        private ItemRepository $items,
        private OrderHistoryRepository $orders,
        private StripePaymentPort $stripePayment
    ) {
    }

    public function startCardPayment(int $userId, int $itemId): array
    {
        $item = $this->items->find($itemId);
        if (!$item) {
            throw new \RuntimeException('Item not found.');
        }

        $stock = $this->items->getStock($itemId);
        if ($stock <= 0) {
            throw new \RuntimeException('Item sold out.');
        }

        $appUrl = config('app.url');
        $successUrl = rtrim($appUrl, '/') . '/api/stripe_success?session_id={CHECKOUT_SESSION_ID}';
        $cancelUrl  = route('item_buy', ['item_id' => $itemId]);

        $stripeUrl = $this->stripePayment->createCheckoutSession(
            userId: $userId,
            amount: $item->price,
            currency: 'jpy',
            itemName: $item->name,
            successUrl: $successUrl,
            cancelUrl:  $cancelUrl
        );

        return [
            'redirect_type' => 'stripe_checkout',
            'stripe_url'    => $stripeUrl,
        ];
    }
}

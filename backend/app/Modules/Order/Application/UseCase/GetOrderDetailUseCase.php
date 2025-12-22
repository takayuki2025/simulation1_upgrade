<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Order\Application\Dto\GetOrderDetailOutput;
use App\Modules\Order\Domain\Repository\OrderRepository;

final class GetOrderDetailUseCase
{
    public function __construct(
        private OrderRepository $orders
    ) {
    }

    public function handle(int $orderId): GetOrderDetailOutput
    {
        $order = $this->orders->findById($orderId);
        if (! $order) {
            throw new \RuntimeException('Order not found');
        }

        return GetOrderDetailOutput::from($order);
    }
}

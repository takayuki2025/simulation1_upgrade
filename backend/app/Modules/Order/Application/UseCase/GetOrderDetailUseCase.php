<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Order\Application\Dto\OrderDetailOutput;
use App\Modules\Order\Domain\Repository\OrderRepository;

final class GetOrderDetailUseCase
{
    public function __construct(
        private OrderRepository $orders,
    ) {
    }

    public function handle(int $orderId, int $userId): OrderDetailOutput
    {
        $order = $this->orders->findById($orderId);

        if ($order->userId() !== $userId) {
            throw new \DomainException('Unauthorized access to order');
        }

        return OrderDetailOutput::fromOrder($order);
    }
}

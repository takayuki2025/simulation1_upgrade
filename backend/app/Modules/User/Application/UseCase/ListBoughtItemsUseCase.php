<?php

namespace App\Modules\User\Application\UseCase;

use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Order\Application\Dto\OrderItemSnapshot;

final class ListBoughtItemsUseCase
{
    public function __construct(
        private OrderRepository $orders,
    ) {
    }

    public function handle(int $userId): array
    {
        $orders = $this->orders->findByBuyer($userId);

        $items = [];

        foreach ($orders as $order) {
            /** @var OrderItemSnapshot $snapshot */
            foreach ($order->items() as $snapshot) {
                $items[] = [
                    'id'         => $snapshot->itemId(),
                    'name'       => $snapshot->name(),
                    'item_image' => $snapshot->imagePath,
                    'order_id'   => $order->id(), // ★ Amazon型遷移の要
                ];
            }
        }

        return $items;
    }
}

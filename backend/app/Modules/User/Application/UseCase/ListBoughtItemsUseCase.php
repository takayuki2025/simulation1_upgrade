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
            foreach ($order->items() as $index => $snapshot) {
                $items[] = [
                    // ★ React key 専用（必ずユニーク）
                    'row_id'     => $order->id() . '-' . $snapshot->itemId() . '-' . $index,

                    // 表示用
                    'item_id'    => $snapshot->itemId(),
                    'name'       => $snapshot->name(),
                    'item_image' => $snapshot->imagePath,

                    // 遷移用
                    'order_id'   => $order->id(),
                ];
            }
        }

        return $items;
    }
}

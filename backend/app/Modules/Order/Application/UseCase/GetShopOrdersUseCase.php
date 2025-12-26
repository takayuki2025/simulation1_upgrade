<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Order\Application\Dto\ShopOrderListOutput;

final class GetShopOrdersUseCase
{
    public function __construct(
        private OrderRepository $orders,
    ) {
    }

    public function handle(int $shopId): array
    {
        $list = $this->orders->findByShop($shopId);

        return array_map(
            fn ($order) => ShopOrderListOutput::fromEntity($order),
            $list
        );
    }
}

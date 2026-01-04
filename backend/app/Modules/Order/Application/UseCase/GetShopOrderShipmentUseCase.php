<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Order\Domain\Repository\OrderQueryRepository;
use App\Modules\Shipment\Domain\Repository\ShipmentQueryRepository;
use App\Modules\Shipment\Application\Factory\ShopOrderShipmentViewFactory;



final class GetShopOrderListUseCase
{
    public function __construct(
        private OrderQueryRepository $orders
    ) {
    }

    public function handle(int $shopId): array
    {
        return $this->orders->findOrderListWithShipmentByShopId($shopId);
    }
}

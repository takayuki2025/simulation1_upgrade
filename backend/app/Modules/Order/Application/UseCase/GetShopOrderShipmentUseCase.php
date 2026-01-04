<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Shipment\Domain\Repository\ShipmentQueryRepository;
use App\Modules\Order\Application\Dto\ShopOrderShipmentOutput;

final class GetShopOrderShipmentUseCase
{
    public function __construct(
        private ShipmentQueryRepository $shipments
    ) {
    }

    public function handle(
        int $shopId,
        int $orderId
    ): ShopOrderShipmentOutput {

        $row = $this->shipments->findByShopIdAndOrderId(
            shopId: $shopId,
            orderId: $orderId
        );

        if (! $row) {
            return ShopOrderShipmentOutput::notCreated($orderId);
        }

        return ShopOrderShipmentOutput::fromRow($row);
    }
}

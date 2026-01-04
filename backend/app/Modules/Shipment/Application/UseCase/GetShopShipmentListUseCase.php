<?php

namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Domain\Repository\ShipmentQueryRepository;
use App\Modules\Shipment\Application\Dto\ShopShipmentListOutput;
use App\Modules\Shipment\Application\Dto\ShopShipmentListItemOutput;

final class GetShopShipmentListUseCase
{
    public function __construct(
        private ShipmentQueryRepository $query,
    ) {
    }

    public function handle(int $shopId): ShopShipmentListOutput
    {
        $rows = $this->query->findByShopId($shopId);

        $items = array_map(
            fn (array $row) => ShopShipmentListItemOutput::fromRow($row),
            $rows
        );

        return new ShopShipmentListOutput($items);
    }
}

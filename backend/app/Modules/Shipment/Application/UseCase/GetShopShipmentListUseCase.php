<?php

namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Application\Dto\ShopShipmentListItemOutput;
use App\Modules\Shipment\Application\Dto\ShopShipmentListOutput;
use App\Modules\Shipment\Domain\Repository\ShipmentManagementQueryRepository;
use App\Modules\Shop\Domain\Entity\Shop;

final class GetShopShipmentListUseCase
{
    public function __construct(
        private ShipmentManagementQueryRepository $query,
    ) {
    }

    public function handle(Shop $shop): ShopShipmentListOutput
    {
        $rows = $this->query->findByShopId($shop->id());

        $items = array_map(
            fn (array $row) => ShopShipmentListItemOutput::fromRow($row),
            $rows
        );

        return new ShopShipmentListOutput($items);
    }
}

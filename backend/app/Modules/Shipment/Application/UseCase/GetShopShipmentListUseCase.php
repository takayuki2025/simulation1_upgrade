<?php

namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Domain\Repository\ShipmentQueryRepository;
use App\Modules\Shop\Domain\Entity\Shop;
use App\Modules\Shipment\Application\Dto\ShopShipmentListOutput;
use App\Modules\Shipment\Application\Dto\ShopShipmentListItemOutput;

final class GetShopShipmentListUseCase
{
    public function __construct(
        private ShipmentQueryRepository $query,
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

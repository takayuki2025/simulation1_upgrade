<?php

namespace App\Modules\Shop\Domain\Repository;

use App\Modules\Shop\Domain\Entity\ShopLedger;

interface ShopLedgerRepository
{
    public function save(ShopLedger $entry): ShopLedger;

    /** @return ShopLedger[] */
    public function listByShopId(int $shopId, int $limit = 100, int $offset = 0): array;

    public function sumBalanceByShopId(int $shopId, string $currency): int;
}

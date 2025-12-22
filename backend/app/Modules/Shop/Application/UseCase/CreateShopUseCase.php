<?php

namespace App\Modules\Shop\Application\UseCase;

use App\Modules\Shop\Application\Dto\CreateShopInput;
use App\Modules\Shop\Application\Dto\ShopOutput;
use App\Modules\Shop\Domain\Entity\Shop;
use App\Modules\Shop\Domain\Repository\ShopRepository;
use Illuminate\Support\Str;

final class CreateShopUseCase
{
    public function __construct(
        private ShopRepository $shops
    ) {
    }

    public function handle(CreateShopInput $input): ShopOutput
    {
        $existing = $this->shops->findByOwnerUserId($input->ownerUserId);
        if ($existing) {
            throw new \DomainException('Shop already exists for this user.');
        }

        $shopCode = 'shop_' . Str::uuid()->toString(); // ★ 生成

        $shop = Shop::create(
            ownerUserId: $input->ownerUserId,
            name: $input->name,
            shopCode: $shopCode,
        );

        $saved = $this->shops->save($shop);

        return ShopOutput::fromEntity($saved);
    }
}

<?php

namespace App\Modules\Item\Application\UseCase\Item;

use App\Modules\Item\Application\Dto\Item\UpdateItemInputDto;
use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Domain\ValueObject\CategoryList;
use App\Modules\Item\Domain\ValueObject\ItemImagePath;
use App\Modules\Item\Domain\ValueObject\Price;
use App\Modules\Item\Domain\ValueObject\StockCount;
use App\Modules\Item\Domain\Exception\TenantMismatchException;
use RuntimeException;

class UpdateItemUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository,
    ) {
    }

    public function execute(UpdateItemInputDto $dto): void
    {
        $tenantId = request()->attributes->get('tenant_id');

        $item = $this->items->findById($dto->itemId); // 既存Repositoryに合わせて取得
        if (! $item) {
            throw new \RuntimeException('Item not found');
        }


        // 所有者チェック（最低限）
        if ($item->getUserId() !== $dto->userId) {
            throw new \RuntimeException('Forbidden: not owner');
        }

        // tenant整合（shop出品の場合）
        $shopId = $item->getShopId();
        if ($shopId !== null && $tenantId !== null && (int)$shopId !== (int)$tenantId) {
            throw new TenantMismatchException((int)$tenantId, (int)$shopId);
        }


        // Domain Entity を新しく再構築してもよいが、
        // 今回は既存 Entity を再利用するパターンでも OK
        $updated = new \App\Modules\Item\Domain\Entity\Item(
            id: $item->getId(),
            userId: $input->userId,
            shopId: $input->shopId,
            name: $input->name,
            price: new Price($input->price),
            explain: $input->explain,
            condition: $input->condition,
            category: new CategoryList($input->category),
            brand: $input->brand,
            itemImage: new ItemImagePath($input->itemImagePath ?? $item->getItemImage()->getPath()),
            remain: new StockCount($input->remain),
        );

        $this->itemRepository->save($updated);
    }
}

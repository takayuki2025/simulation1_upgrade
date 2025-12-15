<?php

namespace App\Modules\Item\Application\UseCase\Item;

use App\Modules\Item\Application\Dto\Item\RegisterItemInputDto;
use App\Modules\Item\Domain\Entity\Item;
use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Domain\ValueObject\CategoryList;
use App\Modules\Item\Domain\ValueObject\ItemId;
use App\Modules\Item\Domain\ValueObject\ItemImagePath;
use App\Modules\Item\Domain\ValueObject\Price;
use App\Modules\Item\Domain\ValueObject\StockCount;
use App\Modules\Item\Domain\Exception\TenantMismatchException;
use Illuminate\Support\Facades\Request;

class RegisterItemUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository,
    ) {
    }

    public function execute(RegisterItemInputDto $input): int
    {


        // ------------------------------------------------
        // ★ 挿入位置: ユースケースメソッドの冒頭 (ここがベスト)
        // ------------------------------------------------
        // 💡 依存性の注入(DI)コンテナからRequestファサードを使って値を取得

        $tenantId = request()->attributes->get('tenant_id'); // JwtAuthenticate がセット
        $shopId = $dto->shopId;

        // shop出品の場合は tenant_id と shop_id の一致を強制
        if ($shopId !== null && $tenantId !== null && (int)$shopId !== (int)$tenantId) {
            throw new TenantMismatchException((int)$tenantId, (int)$shopId);
        }



        // $tenantId = Request::instance()->attributes->get('tenant_id'); // JwtAuthenticate がセット
        // $shopId = $input->shopId;

        // // shop出品の場合は tenant_id と shop_id の一致を強制
        // if ($shopId !== null && $tenantId !== null && (int)$shopId !== (int)$tenantId) {
        //     throw new TenantMismatchException((int)$tenantId, (int)$shopId);
        // }

        $item = new Item(
            id: null,
            userId: $input->userId,
            shopId: $input->shopId,
            name: $input->name,
            price: new Price($input->price),
            explain: $input->explain,
            condition: $input->condition,
            category: new CategoryList($input->category),
            brand: $input->brand,
            itemImage: new ItemImagePath($input->itemImagePath),
            remain: new StockCount($input->remain),
        );

        $saved = $this->itemRepository->save($item);

        return $saved->getId()?->getValue() ?? 0;
    }
}

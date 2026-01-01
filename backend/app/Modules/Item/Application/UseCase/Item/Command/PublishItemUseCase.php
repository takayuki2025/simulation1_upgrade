<?php

namespace App\Modules\Item\Application\UseCase\Item\Command;

use App\Modules\Item\Application\Dto\Item\PublishItemInput;
use App\Modules\Item\Application\Dto\Item\PublishItemOutput;
use App\Modules\Item\Domain\Entity\Item;
use App\Modules\Item\Domain\Repository\ItemDraftRepository;
use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Domain\Service\AtlasKernelService;
use App\Modules\Item\Domain\ValueObject\ItemImagePath;
use App\Modules\Item\Domain\ValueObject\ItemStatus;
use App\Modules\Item\Domain\ValueObject\StockCount;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


final class PublishItemUseCase
{
    public function __construct(
        private ItemDraftRepository $draftRepo,
        private ItemRepository $itemRepo,
        private AtlasKernelService $atlasKernel,
    ) {
    }

    public function execute(
        PublishItemInput $input,
        AuthPrincipal $principal,
        ?int $tenantId,
    ): PublishItemOutput {

        return DB::transaction(function () use ($input, $principal, $tenantId) {

            /* =========================================
             * 1. Draft 取得
             * ========================================= */
            $draft = $this->draftRepo->findById($input->draftId);
            if (! $draft) {
                throw new \DomainException('Draft not found.');
            }

            /* =========================================
             * 2. Publish 可能チェック
             * ========================================= */
            if (! $draft->isPublishableV1()) {
                throw new \DomainException('Draft is not publishable.');
            }

            /* =========================================
             * 3. 出品主体の確定（★ここが唯一の真実）
             * ========================================= */
            $sellerId = $draft->sellerId(); // SellerId ValueObject

            $itemOrigin = $sellerId->type()->value; // USER_PERSONAL | SHOP_MANAGED

            $shopId = $sellerId->isShop()
                ? $sellerId->id()
                : null;

            /* =========================================
             * 4. Draft → Item（INSERT）
             * ========================================= */
            $item = Item::reconstitute(
                id: null,
                itemOrigin: $itemOrigin,
                shopId: $shopId,
                createdByUserId: $principal->userId,
                name: $draft->name()->value(),
                price: $draft->price(),
                explain: $draft->explain(),
                condition: $draft->condition(),
                category: $draft->category(),
                itemImage: null,
                remain: $draft->remain(),
            );

            $itemId = $this->itemRepo->save($item);

            /* =========================================
             * 5. 画像移動（UPDATE）
             * ========================================= */
            if ($draft->itemImage()) {
                $this->itemRepo->updateItemImage(
                    $itemId,
                    ItemImagePath::fromRaw(
                        $draft->itemImage()->publishToPublic()
                    )
                );
            }

            /* =========================================
             * 6. AtlasKernel（1 回だけ）
             * ========================================= */
            $this->atlasKernel->analyzeItem(
                itemId: $itemId->getValue(),
                rawText: $draft->brand()?->raw() ?? '',
                tenantId: $tenantId,
            );

            /* =========================================
             * 7. Draft → Published
             * ========================================= */
            $draft->markPublished();
            $this->draftRepo->save($draft);

            /* =========================================
             * 8. 完了
             * ========================================= */
            return new PublishItemOutput(
                itemId: $itemId->getValue(),
                status: ItemStatus::PUBLISHED->value
            );
        });
    }
}

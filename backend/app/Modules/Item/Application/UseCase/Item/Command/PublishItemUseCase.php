<?php

namespace App\Modules\Item\Application\UseCase\Item\Command;

use App\Modules\Item\Application\Dto\Item\{
    PublishItemInput,
    PublishItemOutput
};
use App\Modules\Item\Domain\Entity\Item;
use App\Modules\Item\Domain\Repository\{
    ItemDraftRepository,
    ItemRepository
};
use App\Modules\Item\Domain\Service\{
    SellerResolver,
    AtlasKernelService
};
use App\Modules\Item\Domain\ValueObject\{
    ItemStatus,
    ItemImagePath,
    CategoryList
};
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class PublishItemUseCase
{
    public function __construct(
        private ItemDraftRepository $draftRepo,
        private ItemRepository $itemRepo,
        private SellerResolver $sellerResolver,
        private AtlasKernelService $atlasKernel,
    ) {
    }

    public function execute(
        PublishItemInput $input,
        AuthPrincipal $principal,
        ?int $tenantId,
    ): PublishItemOutput {

        return DB::transaction(function () use ($input, $principal, $tenantId) {

            /* =====================================================
             * 1. Draft 取得
             * ===================================================== */
            $draft = $this->draftRepo->findById($input->draftId);
            if (! $draft) {
                throw new \DomainException('Draft not found.');
            }

            /* =====================================================
             * 2. Publish 条件チェック
             * ===================================================== */
            if (! $draft->isPublishableV1()) {
                throw new \DomainException('Draft is not publishable.');
            }


            /* =====================================================
             * 3. Draft → Item（INSERT は一度だけ）
             * ===================================================== */
            $item = Item::reconstitute(
                id: null,
                shopId: $draft->sellerId()->id(),
                name: $draft->name()->value(),
                price: $draft->price(),
                explain: $draft->explain(),
                condition: $draft->condition(),
                category: $draft->category() ?? new CategoryList([]),
                itemImage: null, // ← ここではまだ入れない
                remain: $draft->remain(),
            );

            $itemId = $this->itemRepo->save($item);

            /* =====================================================
             * 4. Draft Image → Public Image（UPDATE）
             * ===================================================== */
            if ($draft->itemImage()) {

                $draftPath = $draft->itemImage()->value();

                $publicFilename = Str::uuid() . '.' . pathinfo($draftPath, PATHINFO_EXTENSION);
                $publicPath = 'item_images/' . $publicFilename;

                Storage::disk('public')->put(
                    $publicPath,
                    Storage::disk('public')->get($draftPath)
                );

                $this->itemRepo->updateItemImage(
                    $itemId,
                    ItemImagePath::fromRaw($publicPath)
                );
            }

            /* =====================================================
             * 5. AtlasKernel（この item_id で一度だけ）
             * ===================================================== */
            $this->atlasKernel->analyzeItem(
                itemId: $itemId->getValue(),
                rawText: $draft->brand()?->raw() ?? '',
                tenantId: $tenantId,
            );


            /* =====================================================
             * 6. Draft → Published
             * ===================================================== */
            $draft->markPublished();
            $this->draftRepo->save($draft);

            /* =====================================================
             * 7. 完了
             * ===================================================== */
            return new PublishItemOutput(
                itemId: $itemId->getValue(),
                status: ItemStatus::PUBLISHED->value
            );
        });
    }
}

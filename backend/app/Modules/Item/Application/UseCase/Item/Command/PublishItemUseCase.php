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
             * 3. item_origin 整合性チェック（Draft と Publish の一致）
             * ===================================================== */
            if (method_exists($draft, 'itemOrigin')) {
                if ($draft->itemOrigin() !== $input->itemOrigin) {
                    throw new \DomainException('item_origin mismatch.');
                }
            }

            /* =====================================================
             * 4. 出品主体の確定（Fact）
             * ===================================================== */
            $itemOrigin = $input->itemOrigin;

            $shopId = null;
            $createdByUserId = null;

            if ($itemOrigin === 'USER_PERSONAL') {
                $shopId = null;
                $createdByUserId = $principal->userId(); // ✅ メソッド呼び出し
            } elseif ($itemOrigin === 'SHOP_MANAGED') {
                if (! $input->shopId) {
                    throw new \DomainException('shop_id is required for SHOP_MANAGED.');
                }
                $shopId = (int) $input->shopId;
                $createdByUserId = null;
            } else {
                throw new \DomainException('Invalid item_origin.');
            }

            /* =====================================================
             * 5. Draft → Item（INSERT は一度だけ）
             * ===================================================== */
            // ✅ 新規生成：reconstitute ではなく createNew を使う
            // （もし createNew が未実装なら Item 側に追加してください）

            $item = Item::createNew(
                itemOrigin: $input->itemOrigin,
                shopId: $input->itemOrigin === 'SHOP_MANAGED'
                    ? $input->shopId
                    : null,
                createdByUserId: $input->itemOrigin === 'USER_PERSONAL'
                    ? $principal->userId()
                    : null,
                name: $draft->name()->value(),
                price: $draft->price(),
                explain: $draft->explain(),
                condition: $draft->condition(),
                category: $draft->category(),
                itemImage: null,
                remain: new StockCount(1),
            );

            $itemId = $this->itemRepo->save($item);


            /* =====================================================
             * 6. Draft Image → Public Image（UPDATE）
             * ===================================================== */
            if ($draft->itemImage()) {
                $draftPath = $draft->itemImage()->value();

                $publicFilename = (string) Str::uuid() . '.' . pathinfo($draftPath, PATHINFO_EXTENSION);
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
             * 7. AtlasKernel（この item_id で一度だけ）
             * ===================================================== */
            $this->atlasKernel->analyzeItem(
                itemId: $itemId->getValue(),
                rawText: $draft->brand()?->raw() ?? '',
                tenantId: $tenantId,
            );

            /* =====================================================
             * 8. Draft → Published
             * ===================================================== */
            $draft->markPublished();
            $this->draftRepo->save($draft);

            /* =====================================================
             * 9. 完了
             * ===================================================== */
            return new PublishItemOutput(
                itemId: $itemId->getValue(),
                status: ItemStatus::PUBLISHED->value
            );
        });
    }
}

<?php

namespace App\Modules\Item\Application\UseCase\Item\Command;

use App\Modules\Item\Domain\Entity\Item;
use App\Modules\Item\Application\Dto\Item\{
    PublishItemInput,
    PublishItemOutput
};
use App\Modules\Item\Domain\Repository\{
    ItemDraftRepository,
    ItemRepository
};
use App\Modules\Item\Domain\Service\SellerResolver;
use App\Modules\Item\Domain\ValueObject\ItemStatus;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;

final class PublishItemUseCase
{
    public function __construct(
        private ItemDraftRepository $draftRepo,
        private ItemRepository $itemRepo,
        private NormalizeBrandUseCase $normalizeBrandUseCase,
        private SellerResolver $sellerResolver,
    ) {}

    public function execute(
        PublishItemInput $input,
        AuthPrincipal $principal,
        ?int $tenantId,
    ): PublishItemOutput {
        // =========================================
        // 1. Draft 取得（存在チェック）
        // =========================================
        $draft = $this->draftRepo->findById($input->draftId);

        if (! $draft) {
            throw new \DomainException('Draft not found.');
        }

        // =========================================
        // 2. 認可（Seller / Tenant）
        // =========================================
        $this->sellerResolver->resolve(
            $draft->sellerId()->asString(),
            $principal,
            $tenantId
        );

        // =========================================
        // 3. Brand 正規化（副作用あり）
        //    ★ Draft を更新する UseCase
        // =========================================
        // $this->normalizeBrandUseCase->execute($input->draftId);

        // =========================================
        // 4. ★ 再取得（超重要）
        //    normalize による再構築差分を反映
        // =========================================
        $draft = $this->draftRepo->findById($input->draftId);

        if (! $draft) {
            throw new \DomainException('Draft not found after normalization.');
        }


        logger()->info('Publish debug', [
    'draft_id' => $draft->id()->value(),
    'status' => $draft->status()->value,
    'hasImage' => $draft->hasImage(),
    'image' => $draft->itemImage()?->value(),
]);
        // =========================================
        // 5. Publish 条件チェック（最終形）
        // =========================================
        if (! $draft->isPublishableV1()) {
            throw new \DomainException('Draft is not publishable.');
        }

        // =========================================
        // 6. Item 生成（Draft → Item）
        // =========================================
        $itemId = $this->itemRepo->nextIdentity();

        $item = Item::publishFromDraft(
            $itemId,
            $draft
        );

        $this->itemRepo->save($item);

        // =========================================
        // 7. Draft を Published に更新
        // =========================================
        $draft->markPublished();
        $this->draftRepo->save($draft);

        // =========================================
        // 8. Output
        // =========================================
        return new PublishItemOutput(
            itemId: $itemId->value(),
            status: ItemStatus::PUBLISHED->value
        );
    }
}
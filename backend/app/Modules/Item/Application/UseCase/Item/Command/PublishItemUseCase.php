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
use App\Modules\Item\Domain\Service\{
    SellerResolver,
    AtlasKernelService
};
use App\Modules\Item\Domain\ValueObject\ItemStatus;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;

final class PublishItemUseCase
{
    public function __construct(
        private ItemDraftRepository $draftRepo,
        private ItemRepository $itemRepo,
        private SellerResolver $sellerResolver,
        private AtlasKernelService $atlasKernel, // ★ 正式DI
    ) {
    }

    public function execute(
        PublishItemInput $input,
        AuthPrincipal $principal,
        ?int $tenantId,
    ): PublishItemOutput {
        // 1. Draft 取得
        $draft = $this->draftRepo->findById($input->draftId);
        if (! $draft) {
            throw new \DomainException('Draft not found.');
        }

        // 2. 認可（今はスキップOK）
        // $this->sellerResolver->resolve(...);

        // 3. Publish 条件チェック
        if (! $draft->isPublishableV1()) {
            throw new \DomainException('Draft is not publishable.');
        }

        // 4. Item 生成
        $item = Item::publishFromDraft($draft);
        $itemId = $this->itemRepo->save($item);


        // 5. ★ AtlasKernel 実行
        $this->atlasKernel->analyzeItem(
            itemId: $itemId->getValue(),
            rawText: $draft->brand()
       ? $draft->brand()->raw()
       : '',
            tenantId: $tenantId,
        );


        // 6. Draft を Published に
        $draft->markPublished();
        $this->draftRepo->save($draft);

        return new PublishItemOutput(
            itemId: $itemId->getValue(),
            status: ItemStatus::PUBLISHED->value
        );
    }
}

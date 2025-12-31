<?php

namespace App\Modules\Item\Application\UseCase\Item\Command;

use App\Modules\Item\Application\Dto\Item\CreateItemDraftInput;
use App\Modules\Item\Application\Dto\Item\CreateItemDraftOutput;
use App\Modules\Item\Domain\Entity\ItemDraft;
use App\Modules\Item\Domain\Repository\ItemDraftRepository;
use App\Modules\Item\Domain\ValueObject\{
    ItemName,
    Money,
    BrandName,
    ItemStatus,
    SellerId
};
use App\Modules\Auth\Application\Service\AssignSellerRoleService;

final class CreateItemDraftUseCase
{
    public function __construct(
        private ItemDraftRepository $draftRepository,
        private AssignSellerRoleService $assignSellerRoleService,
    ) {
    }

    public function execute(
        CreateItemDraftInput $input,
        int $userId,
    ): CreateItemDraftOutput {

        /**
         * Draft フェーズでは出品主体を確定しない
         * → 常に「操作ユーザー」を seller として扱う
         */
        $sellerId = SellerId::user($userId);

        /**
         * 初回出品時に seller ロール付与（個人）
         */
        $this->assignSellerRoleService
            ->assignIndividualIfNotExists($userId);

        $draftId = $this->draftRepository->nextIdentity();

        $draft = ItemDraft::create(
            id: $draftId,
            sellerId: $sellerId,
            name: new ItemName($input->name),
            price: new Money(
                $input->priceAmount,
                $input->priceCurrency
            ),
            brandRaw: $input->brandRaw
                ? new BrandName($input->brandRaw)
                : null,
            explain: $input->explain,
            condition: $input->condition,
            category: $input->category,
        );

        $this->draftRepository->save($draft);

        return new CreateItemDraftOutput(
            $draftId->value(),
            ItemStatus::DRAFT->value,
            true
        );
    }
}

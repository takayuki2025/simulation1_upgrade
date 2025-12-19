<?php

namespace App\Modules\Item\Application\UseCase\Item\Command;

use App\Modules\Item\Application\Dto\Item\{
    CreateItemDraftInput,
    CreateItemDraftOutput
};
use App\Modules\Item\Domain\Entity\ItemDraft;
use App\Modules\Item\Domain\Repository\ItemDraftRepository;
use App\Modules\Item\Domain\Service\SellerResolver;
use App\Modules\Item\Domain\ValueObject\{
    ItemName,
    Money,
    BrandName,
    ItemStatus
};
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;

final class CreateItemDraftUseCase
{
    public function __construct(
        private ItemDraftRepository $draftRepository,
        private SellerResolver $sellerResolver,
    ) {
    }

    public function execute(
        CreateItemDraftInput $input,
        AuthPrincipal $principal,
        ?int $tenantId,
    ): CreateItemDraftOutput {

        // ★ 正しい呼び出し
        $sellerId = $this->sellerResolver->resolve(
            $input->sellerId,
            $principal,
            $tenantId
        );

        $draftId = $this->draftRepository->nextIdentity();

        $draft = ItemDraft::create(
            $draftId,
            $sellerId,
            new ItemName($input->name),
            new Money($input->priceAmount, $input->priceCurrency),
            $input->brandRaw ? new BrandName($input->brandRaw) : null,
            $input->explain,
            $input->condition,
            $input->category,
        );

        $this->draftRepository->save($draft);

        return new CreateItemDraftOutput(
            $draftId->value(),
            ItemStatus::DRAFT->value,
            true
        );
    }
}

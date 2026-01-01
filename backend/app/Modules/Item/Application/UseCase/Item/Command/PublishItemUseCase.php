<?php

namespace App\Modules\Item\Application\UseCase\Item\Command;

use App\Modules\Item\Application\Dto\Item\PublishItemInput;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use App\Modules\Item\Domain\Repository\ItemDraftRepository;
use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Domain\Entity\Item;
use App\Modules\Item\Domain\Service\SellerAuthorizationService;
use App\Modules\Item\Domain\ValueObject\StockCount;
use App\Modules\Item\Domain\ValueObject\SellerType;
use App\Modules\Item\Domain\ValueObject\ItemOrigin;
use App\Modules\Item\Domain\Event\ItemPublished;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\DB;
use DomainException;

final class PublishItemUseCase
{
    public function __construct(
        private ItemDraftRepository $draftRepository,
        private ItemRepository $itemRepository,
        private SellerAuthorizationService $sellerAuth,
    ) {
    }

    public function execute(
        PublishItemInput $input,
        AuthPrincipal $principal,
        ?int $tenantId,
    ): void {
        DB::transaction(function () use ($input, $principal, $tenantId) {

            $draft = $this->draftRepository->findById($input->draftId);

            if (! $draft || ! $draft->isPublishableV1()) {
                throw new DomainException('Draft is not publishable');
            }

            // 出品主体（Draft の SoT）
            $sellerId = $draft->sellerId();

            // 権限チェック
            if (! $this->sellerAuth->canOperate($sellerId, $principal)) {
                throw new DomainException('Not allowed to publish this item');
            }

            // SHOP 出品の shop_id 確定
            if ($sellerId->type() === SellerType::SHOP) {
                if ($sellerId->id() === null && $input->shopId === null) {
                    throw new DomainException('shop_id is required to publish');
                }

                if (
                    $sellerId->id() !== null &&
                    $input->shopId !== null &&
                    $sellerId->id() !== $input->shopId
                ) {
                    throw new DomainException('shop_id mismatch');
                }
            }

            // Item 生成（Fact only）
            $item = Item::createNew(
                itemOrigin: $sellerId->type() === SellerType::SHOP
                    ? ItemOrigin::SHOP_MANAGED->value
                    : ItemOrigin::USER_PERSONAL->value,
                shopId: $sellerId->type() === SellerType::SHOP
                    ? ($sellerId->id() ?? $input->shopId)
                    : null,
                createdByUserId: $sellerId->type() === SellerType::SHOP
                    ? null
                    : $principal->userId,
                name: $draft->name()->value(),
                price: $draft->price(),
                explain: $draft->explain(),
                condition: $draft->condition(),
                category: $draft->category(),
                itemImage: $draft->itemImage(),
                remain: new StockCount(1),
            );

            // 永続化（★ Entity に ID が注入される）
            $this->itemRepository->save($item);

            // ★ Entity から ID を読む（唯一の正解）
            $itemId = $item->id();

            // rawText を確定（将来再解析できる完全 SoT）

            $rawText = trim(implode(' ', array_filter([
                $draft->name()->value(),
                $draft->explain(),
                method_exists($draft, 'brand')
                    ? $draft->brand()?->value()
                    : null,
                $draft->condition(),
            ])));


            Event::dispatch(
                new ItemPublished(
                    itemId: $itemId,
                    rawText: $rawText,
                    tenantId: $tenantId,
                )
            );

            $draft->markPublished();
            $this->draftRepository->save($draft);
        });
    }
}

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
use App\Modules\Item\Domain\ValueObject\ItemOrigin as ItemOriginVO;
use App\Modules\Item\Domain\Enum\ItemOrigin as ItemOriginEnum;
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

            // 出品主体（SoT）
            $sellerId = $draft->sellerId();

            if (! $this->sellerAuth->canOperate($sellerId, $principal)) {
                throw new DomainException('Not allowed to publish this item');
            }

            // shop_id 整合性
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

            /**
             * ★ Publish で「事実」を確定させる
             * - price_amount は必ず int
             * - published_at は必ず now
             */
            $price = $draft->price();
            if ($price === null) {
                throw new DomainException('price is required to publish');
            }

            // Item 生成（Operational Truth）

            $item = Item::createNew(
                itemOrigin: ItemOriginVO::from(
                    $sellerId->type() === SellerType::SHOP
                        ? ItemOriginEnum::SHOP_MANAGED->value
                        : ItemOriginEnum::USER_PERSONAL->value
                ),
                shopId: $sellerId->type() === SellerType::SHOP
                    ? ($sellerId->id() ?? $input->shopId)
                    : null,
                createdByUserId: $sellerId->type() === SellerType::SHOP
                    ? null
                    : $principal->userId,
                name: $draft->name()->value(),
                price: $price,
                explain: $draft->explain(),
                condition: $draft->condition(),
                category: $draft->category(),
                itemImage: $draft->itemImage(),
                remain: new StockCount(1),
            );


            // ★ publish 時刻を確定
            $item->markPublished(now());

            // 永続化
            $this->itemRepository->save($item);
            $itemId = $item->id();

            // 🔑 rawText を確定（再解析の完全 SoT）
            $rawText = trim(implode(' ', array_filter([
                $draft->name()->value(),
                $draft->explain(),
                $draft->brand()?->value() ?? null,
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

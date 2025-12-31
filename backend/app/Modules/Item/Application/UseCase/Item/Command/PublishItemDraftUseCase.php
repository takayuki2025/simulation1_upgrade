<?php

namespace App\Modules\Item\Application\UseCase\Item\Command;

use App\Modules\Item\Application\Dto\Item\PublishItemDraftInput;
use App\Modules\Auth\Application\Service\AuthContext;
use App\Modules\Item\Domain\Repository\ItemDraftRepository;
use App\Modules\Item\Domain\Repository\ItemRepository;
use Illuminate\Support\Facades\DB;
use App\Modules\Item\Domain\Entity\Item;
use App\Modules\Item\Domain\ValueObject\StockCount;
use DomainException;

final class PublishItemDraftUseCase
{
    public function __construct(
        private ItemDraftRepository $draftRepository,
        private ItemRepository $itemRepository,
    ) {
    }

    public function handle(
        PublishItemDraftInput $input,
        AuthContext $auth,
    ): void {
        $principal = $auth->principal();

        $draft = $this->draftRepository->findById($input->draftId);
        if (! $draft || ! $draft->isPublishableV1()) {
            throw new DomainException('Draft is not publishable');
        }

        match ($input->itemOrigin) {
            'USER_PERSONAL' => $this->publishAsPersonal(
                $draft,
                $principal->userId()
            ),
            'SHOP_MANAGED' => $this->publishAsShopManaged(
                $draft,
                $input->shopId
            ),
            default => throw new DomainException('Invalid item_origin'),
        };

        $draft->markPublished();
        $this->draftRepository->save($draft);
    }

    /**
     * 個人出品
     */
    private function publishAsPersonal($draft, int $userId): void
    {
        $item = Item::createNew(
            shopId: null,
            createdByUserId: $userId,
            name: $draft->name()->value(),
            price: $draft->price(),
            explain: $draft->explain(),
            condition: $draft->condition(),
            category: $draft->category(),
            itemImage: $draft->itemImage(),
            remain: new StockCount(1),
        );

        $itemId = $this->itemRepository->save($item);

        // ★ DB が真実（必ず明示）
        DB::table('items')
            ->where('id', $itemId->getValue())
            ->update([
                'item_origin' => 'USER_PERSONAL',
            ]);
    }

    /**
     * ショップ管理商品
     */
    private function publishAsShopManaged($draft, ?int $shopId): void
    {
        if (! $shopId) {
            throw new DomainException('shop_id is required');
        }

        $item = Item::createNew(
            shopId: $shopId,
            createdByUserId: null,
            name: $draft->name()->value(),
            price: $draft->price(),
            explain: $draft->explain(),
            condition: $draft->condition(),
            category: $draft->category(),
            itemImage: $draft->itemImage(),
            remain: new StockCount(1),
        );

        $itemId = $this->itemRepository->save($item);

        // ★ DB が真実（必ず明示）
        DB::table('items')
            ->where('id', $itemId->getValue())
            ->update([
                'item_origin' => 'SHOP_MANAGED',
            ]);
    }
}

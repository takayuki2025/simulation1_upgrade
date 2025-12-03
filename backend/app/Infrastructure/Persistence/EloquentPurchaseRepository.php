<?php

namespace App\Infrastructure\Persistence;

use App\Domain\Repository\PurchaseRepository;
use App\Domain\Entity\OrderHistory as OrderHistoryEntity;
use App\Models\Item;
use App\Models\OrderHistory;
use App\Models\User;

class EloquentPurchaseRepository implements PurchaseRepository
{
    public function getItemForPurchase(int $itemId)
    {
        return Item::findOrFail($itemId);
    }

    public function reduceItemStock(int $itemId, int $qty): bool
    {
        $item = Item::findOrFail($itemId);
        if ($item->remain < $qty) {
            return false;
        }

        $item->remain -= $qty;
        return $item->save();
    }

    public function saveOrderHistory(int $buyerId, int $itemId, int $price, string $stripeSessionId): OrderHistoryEntity
    {
        $h = OrderHistory::create([
            'buyer_id' => $buyerId,
            'item_id'  => $itemId,
            'price'    => $price,
            'stripe_session_id' => $stripeSessionId,
        ]);

        return new OrderHistoryEntity(
            id: $h->id,
            buyerId: $h->buyer_id,
            itemId: $h->item_id,
            price: $h->price,
            stripeSessionId: $h->stripe_session_id,
            createdAt: $h->created_at
        );
    }

    public function getUserAddress(int $userId): array
    {
        $u = User::findOrFail($userId);
        return [
            'post_number' => $u->post_number,
            'address'     => $u->address,
            'building'    => $u->building,
        ];
    }

    public function updateAddress(int $userId, array $data): bool
    {
        $u = User::findOrFail($userId);
        $u->post_number = $data['post_number'];
        $u->address     = $data['address'];
        $u->building    = $data['building'];
        return $u->save();
    }
}

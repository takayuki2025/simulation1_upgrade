<?php

namespace App\Modules\User\Infrastructure\Persistence\Repository;

use App\Models\Item;
use App\Modules\User\Domain\Repository\MypageRepository;

final class EloquentMypageRepository implements MypageRepository
{
    /**
     * 出品した商品一覧
     *
     * ✔ USER_PERSONAL のみ
     * ✔ created_by_user_id が自分のものだけ
     * ✔ SHOP_MANAGED（Seeder商品）は一切出さない
     */
    public function listSellItems(int $userId): array
    {
        return Item::query()
            ->where('item_origin', 'USER_PERSONAL')
            ->where('created_by_user_id', $userId)
            ->orderByDesc('id')
            ->get()
            ->map(fn ($item) => [
                'row_id'     => 'sell-' . $item->id,
                'item_id'    => $item->id,
                'name'       => $item->name,
                'item_image' => $item->item_image,
                'price'      => $item->price,
            ])
            ->toArray();
    }

    /**
     * 購入した商品一覧
     * ※ ここは Order 側が完成するまで既存ロジック維持でOK
     */
    public function listBoughtItems(int $userId): array
    {
        return [];
    }

    /**
     * 購入前の住所フォーム
     */
    public function findAddressForm(int $userId, int $itemId): array
    {
        $user = \App\Models\User::findOrFail($userId);
        $item = Item::findOrFail($itemId);

        return [
            'user' => [
                'id'          => $user->id,
                'post_number' => $user->post_number,
                'address'     => $user->address,
                'building'    => $user->building,
            ],
            'item' => [
                'id'    => $item->id,
                'name'  => $item->name,
                'price' => $item->price,
            ],
        ];
    }

    /**
     * 住所更新
     */
    public function updateAddress(
        int $userId,
        int $itemId,
        string $postNumber,
        string $address,
        ?string $building
    ): bool {
        return \App\Models\User::where('id', $userId)->update([
            'post_number' => $postNumber,
            'address'     => $address,
            'building'    => $building,
        ]) > 0;
    }
}

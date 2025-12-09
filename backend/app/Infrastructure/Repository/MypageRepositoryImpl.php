<?php

namespace App\Infrastructure\Repository;

use App\Domain\Repository\MypageRepository;

class MypageRepositoryImpl implements MypageRepository
{
    /**
     * 出品した商品一覧（ダミーデータ）
     */
    public function listSellItems(int $userId): array
    {
        return [
            [
                'item_id' => 1,
                'name' => 'ダミー出品商品',
                'price' => 1000,
            ],
        ];
    }

    /**
     * 購入した商品一覧（ダミー）
     */
    public function listBoughtItems(int $userId): array
    {
        return [
            [
                'item_id' => 5,
                'name' => 'ダミー購入商品',
                'price' => 2500,
            ],
        ];
    }

    /**
     * 配送先入力フォーム情報（ダミー）
     */
    public function findAddressForm(int $userId, int $itemId): array
    {
        return [
            'user_id' => $userId,
            'item_id' => $itemId,
            'post_number' => '',
            'address' => '',
            'building' => '',
        ];
    }

    /**
     * 配送先を更新（成功したことにする）
     */
    public function updateAddress(
        int $userId,
        int $itemId,
        string $postNumber,
        string $address,
        ?string $building
    ): bool {
        return true;
    }
}

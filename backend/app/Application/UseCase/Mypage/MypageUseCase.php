<?php

namespace App\Application\UseCase\Mypage;

use App\Domain\Repository\MypageRepository;

class MypageUseCase
{
    public function __construct(
        private MypageRepository $repo
    ) {
    }

    /**
     * 出品一覧
     */
    public function listSellItems(int $userId)
    {
        return $this->repo->listSellItems($userId);
    }

    /**
     * 購入一覧
     */
    public function listBoughtItems(int $userId)
    {
        return $this->repo->listBoughtItems($userId);
    }

    /**
     * 購入前住所フォーム表示
     */
    public function getAddressForm(int $userId, int $itemId)
    {
        return $this->repo->findAddressForm($userId, $itemId);
    }

    /**
     * 購入用の配送先住所を更新（購入画面専用）
     */
    public function updatePurchaseAddress(int $userId, int $itemId, array $data)
    {
        return $this->repo->updateAddress(
            userId: $userId,
            itemId: $itemId,
            postNumber: $data['post_number'],
            address: $data['address'],
            building: $data['building'] ?? null
        );
    }
}

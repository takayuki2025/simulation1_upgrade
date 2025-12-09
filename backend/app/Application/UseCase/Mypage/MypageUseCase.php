<?php

namespace App\Application\UseCase\Mypage;

use App\Domain\Repository\MypageRepository;

class MypageUseCase
{
    private MypageRepository $repo;

    public function __construct(MypageRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * プロフィール情報を取得
     */
    public function getProfile(int $userId): array
    {
        return [
            'user' => $this->repo->getProfile($userId)
        ];
    }

    /**
     * 出品一覧
     */
    public function listSellItems(int $userId): array
    {
        return $this->repo->listSellItems($userId);
    }

    /**
     * 購入一覧
     */
    public function listBoughtItems(int $userId): array
    {
        return $this->repo->listBoughtItems($userId);
    }
}

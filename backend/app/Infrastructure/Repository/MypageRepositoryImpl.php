<?php

namespace App\Infrastructure\Repository;

use App\Domain\Repository\MypageRepository;
use Illuminate\Support\Facades\DB;

class MypageRepositoryImpl implements MypageRepository
{
    /**
     * 🔹 ユーザープロフィール取得
     */
    public function getProfile(int $userId): array
    {
        $row = DB::table('users')
            ->select(
                'id',
                'name',
                'email',
                'email_verified_at',
                'post_number',
                'address',
                'building',
                'user_image'
            )
            ->where('id', $userId)
            ->first();

        return $row ? (array) $row : [];
    }

    /**
     * 🔹 出品した商品一覧
     */
    public function listSellItems(int $userId): array
    {
        return DB::table('items')
            ->where('seller_id', $userId)
            ->orderByDesc('id')
            ->get()
            ->toArray();
    }

    /**
     * 🔹 購入した商品一覧
     */
    public function listBoughtItems(int $userId): array
    {
        return DB::table('purchases')
            ->where('buyer_id', $userId)
            ->orderByDesc('id')
            ->get()
            ->toArray();
    }

    /**
     * 🔹 購入フォーム表示用（購入者の住所 × 商品）
     */
    public function findAddressForm(int $userId, int $itemId): array
    {
        $user = DB::table('users')
            ->select('post_number', 'address', 'building')
            ->where('id', $userId)
            ->first();

        $item = DB::table('items')
            ->select('id', 'name', 'price')
            ->where('id', $itemId)
            ->first();

        return [
            'user' => $user ? (array) $user : null,
            'item' => $item ? (array) $item : null,
        ];
    }

    /**
     * 🔹 購入時の住所更新
     */
    public function updateAddress(
        int $userId,
        int $itemId,
        string $postNumber,
        string $address,
        ?string $building
    ): bool {
        return DB::table('users')
            ->where('id', $userId)
            ->update([
                'post_number' => $postNumber,
                'address'     => $address,
                'building'    => $building,
                'updated_at'  => now(),
            ]) > 0;
    }
}

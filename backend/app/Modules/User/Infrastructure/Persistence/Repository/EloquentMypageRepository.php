<?php

namespace App\Modules\User\Infrastructure\Persistence\Repository;

use App\Modules\User\Domain\Repository\MypageRepository;
use App\Models\User;
use App\Models\Item;
use App\Models\OrderHistory;
use Illuminate\Support\Facades\DB;

class EloquentMypageRepository implements MypageRepository
{
    /**
     * 🔹 既存互換用（そのうち廃止予定）
     * 今後は ProfileUseCase を使うので、ここからは徐々に離脱していく。
     */
    public function getProfile(int $userId): array
    {
        $user = User::select(
            'id',
            'name',
            'email',
            'email_verified_at',
            'post_number',
            'address',
            'building',
            'user_image'
        )
            ->find($userId);

        return $user ? $user->toArray() : [];
    }

    public function listSellItems(int $userId): array
    {
        // ユーザーが所属する shop_id 一覧を取得
        $shopIds = DB::table('role_user')
            ->where('user_id', $userId)
            ->pluck('shop_id')
            ->all();

        if (empty($shopIds)) {
            return [];
        }

        return Item::whereIn('shop_id', $shopIds)
            ->orderByDesc('id')
            ->get()
            ->toArray();
    }

    public function listBoughtItems(int $userId): array
    {
        return OrderHistory::where('buyer_id', $userId)
            ->with('item')
            ->orderByDesc('id')
            ->get()
            ->toArray();
    }

    public function findAddressForm(int $userId, int $itemId): array
    {
        $user = User::findOrFail($userId);
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

    public function updateAddress(
        int $userId,
        int $itemId,
        string $postNumber,
        string $address,
        ?string $building
    ): bool {
        return User::where('id', $userId)->update([
            'post_number' => $postNumber,
            'address'     => $address,
            'building'    => $building,
        ]) > 0;
    }
}

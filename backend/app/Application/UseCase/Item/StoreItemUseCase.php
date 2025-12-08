<?php

namespace App\Application\UseCase\Item;

use App\Models\Shop;
use App\Models\User;
use App\Domain\Repository\ItemRepositoryInterface;

class StoreItemUseCase
{
    public function __construct(
        private ItemRepositoryInterface $items, // DI でリポジトリを受け取る
        // 将来ここに AuthorizationService / RoleService などを注入する
    ) {
    }

    /**
     * アイテムを作成するユースケース
     *
     * @param  Shop  $shop   マルチテナントの対象店舗
     * @param  User  $user   現在ログイン中ユーザー
     * @param  array $payload フロントから渡ってきたデータ
     */
    public function __invoke(Shop $shop, User $user, array $payload)
    {
        // ★ 将来ここに RBAC チェックを入れる（OWNER / STAFF など）
        // $this->authorizationService->ensureCanCreateItem($user, $shop);

        $data = [
            'shop_id'    => $shop->id,
            'user_id'    => $user->id,
            'name'       => $payload['name'],
            'price'      => $payload['price'],
            'brand'      => $payload['brand'] ?? null,
            'explain'    => $payload['explain'],
            'condition'  => $payload['condition'],
            'category'   => $payload['category'],
            'item_image' => $payload['item_image'],
            'remain'     => $payload['remain'],
        ];

        return $this->items->create($data);
    }
}

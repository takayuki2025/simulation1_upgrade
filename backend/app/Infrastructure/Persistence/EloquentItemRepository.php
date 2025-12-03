<?php

namespace App\Infrastructure\Persistence;

use App\Domain\Repository\ItemRepository;
use App\Domain\Entity\Item as ItemEntity;
use App\Models\Item;
use Illuminate\Support\Facades\Log;


class EloquentItemRepository implements ItemRepository
{
    /** 一覧取得 */
    public function listAll()
    {
        return Item::with('user')->orderBy('id', 'desc')->get();
    }

    /** 単体取得 */
    public function find(int $id)
    {
        return Item::with('user')->find($id);
    }

    /** 画像アップロード */
    public function uploadImage($req)
    {
        $path = $req->file('image')->store('item_images', 'public');
        return ['image_path' => $path];
    }

    /** 出品作成 */
    public function create(array $data)
    {
        return Item::create($data);
    }

    /** 購入確認 */
    public function purchaseConfirm(int $id)
    {
        $item = Item::find($id);
        if (!$item) {
            throw new \RuntimeException("Item not found");
        }
        return $item;
    }
}

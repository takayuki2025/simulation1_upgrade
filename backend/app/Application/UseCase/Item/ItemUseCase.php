<?php

namespace App\Application\UseCase\Item;

use App\Domain\Repository\ItemRepository;
use Illuminate\Http\Request;

class ItemUseCase
{
    public function __construct(private ItemRepository $items)
    {
    }

    /** 一覧 */
    public function list()
    {
        return $this->items->listAll();
    }

    /** 詳細 */
    public function detail(int $id)
    {
        return $this->items->find($id);
    }

    /** 出品画像アップロード */
    public function uploadImage(Request $req)
    {
        return $this->items->uploadImage($req);
    }

    /** 出品作成 */
    public function create(Request $req)
    {
        return $this->items->create($req->all());
    }

    /** 購入確認 */
    public function purchaseConfirm(int $id)
    {
        return $this->items->purchaseConfirm($id);
    }
}

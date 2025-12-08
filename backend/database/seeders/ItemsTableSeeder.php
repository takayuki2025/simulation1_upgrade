<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User; // Userモデルを使用するために追加
use App\Models\Shop;

class ItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {


        // =============================================
        // 💡 修正箇所 1: shop_id に使う Shop レコードを取得する
        // =============================================
        $shop = Shop::first();

        // if (!$shop) {
        //     \Log::error("ItemsTableSeeder: Shop record not found. Cannot set shop_id.");
        //     // ショップが存在しない場合は処理を停止
        //     return;
        // }
        // $defaultShopId = $shop->id;

        // UsersTableSeeder で作成したユーザーのメールアドレスリスト (最新版に更新)
        $userEmails = [
            'valid.email@example.com',      // ユーザー1
            'taro.y@coachtech.com',         // ユーザー2
            'reina.n@coachtech.com',        // ユーザー3
            'tomomi.a@coachtech.com',       // ユーザー4
        ];

        // ユーザーのメールアドレスをキー、実際のIDを値とする連想配列を取得
        // 例: ['valid.email@example.com' => 5, 'taro.y@coachtech.com' => 6, ...]
        $userIds = User::whereIn('email', $userEmails)
                       ->pluck('id', 'email')
                       ->toArray();

        // ユーザーIDが見つからない場合のフォールバック（デバッグ用）
        if (count($userIds) !== count($userEmails)) {
            \Log::error("ItemsTableSeeder: User IDs could not be retrieved correctly.");
            // 処理を継続させず、エラーとする
            // throw new \Exception("Required users for seeder are missing.");
        }


        // 商品データ。user_idを動的に割り当てるように修正
        $params = [
            [
                'user_id' => $userIds['valid.email@example.com'] ?? 1, // ユーザー1のIDを使用
                'name' => '腕時計',
                'price' => 15000,
                'brand' => 'Rolax',
                'explain' => 'スタイリッシュなデザインのメンズ腕時計',
                'condition' => '良好',
                'category' => json_encode(['メンズ']),
                'item_image' => 'storage/item_images/Armani+Mens+Clock.jpg',
                'remain' => 1,
                'shop_id' => 1, // 💡 ここを追加
            ],
            [
                'user_id' => $userIds['valid.email@example.com'] ?? 1, // ユーザー1のIDを使用
                'name' => 'HDD',
                'price' => 5000,
                'brand' => '西芝',
                'explain' => '高速で信頼性の高いハードディスク',
                'condition' => '目立った傷や汚れなし',
                'category' => json_encode(['家電']),
                'item_image' => 'storage/item_images/HDD+Hard+Disk.jpg',
                'remain' => 1,
                'shop_id' => 1,
            ],
            [
                'user_id' => $userIds['taro.y@coachtech.com'] ?? 2, // ユーザー2のIDを使用
                'name' => '玉ねぎ３束',
                'price' => 300,
                'brand' => 'なし',
                'explain' => '新鮮な玉ねぎ3束のセット',
                'condition' => 'やや傷や汚れあり',
                'category' => json_encode(['キッチン']),
                'item_image' => 'storage/item_images/iLoveIMG+d.jpg',
                'remain' => 1,
                'shop_id' => 2,
            ],
            [
                'user_id' => $userIds['taro.y@coachtech.com'] ?? 2, // ユーザー2のIDを使用
                'name' => '革靴',
                'price' => 4000,
                'brand' => '',
                'explain' => 'クラシックなデザインの革靴',
                'condition' => '状態が悪い',
                'category' => json_encode(['メンズ']),
                'item_image' => 'storage/item_images/Leather+Shoes+Product+Photo.jpg',
                'remain' => 1,
                'shop_id' => 2,
            ],
            [
                'user_id' => $userIds['reina.n@coachtech.com'] ?? 3, // ユーザー3のIDを使用
                'name' => 'ノートPC',
                'price' => 45000,
                'brand' => '',
                'explain' => '高性能なノートパソコン',
                'condition' => '良好',
                'category' => json_encode(['家電']),
                'item_image' => 'storage/item_images/Living+Room+Laptop.jpg',
                'remain' => 1,
                'shop_id' => 3,
            ],
            [
                'user_id' => $userIds['reina.n@coachtech.com'] ?? 3, // ユーザー3のIDを使用
                'name' => 'マイク',
                'price' => 8000,
                'brand' => 'なし',
                'explain' => '高音質のレコーディング用マイク',
                'condition' => '目立った傷や汚れなし',
                'category' => json_encode(['家電']),
                'item_image' => 'storage/item_images/Music+Mic+4632231.jpg',
                'remain' => 1,
                'shop_id' => 3,
            ],
            [
                'user_id' => $userIds['reina.n@coachtech.com'] ?? 3, // ユーザー3のIDを使用
                'name' => 'ショルダーバッグ',
                'price' => 3500,
                'brand' => '',
                'explain' => 'おしゃれなショルダーバッグ',
                'condition' => 'やや傷や汚れあり',
                'category' => json_encode(['レディース']),
                'item_image' => 'storage/item_images/Purse+fashion+pocket.jpg',
                'remain' => 1,
                'shop_id' => 3,
            ],
            [
                'user_id' => $userIds['tomomi.a@coachtech.com'] ?? 4, // ユーザー4のIDを使用
                'name' => 'タンブラー',
                'price' => 500,
                'brand' => 'なし',
                'explain' => '使いやすいタンブラー',
                'condition' => '状態が悪い',
                'category' => json_encode(['キッチン']),
                'item_image' => 'storage/item_images/Tumbler+souvenir.jpg',
                'remain' => 1,
                'shop_id' => 4,
            ],
            [
                'user_id' => $userIds['tomomi.a@coachtech.com'] ?? 4, // ユーザー4のIDを使用
                'name' => 'コーヒーミル',
                'price' => 4000,
                'brand' => 'Starbacks',
                'explain' => '手動のコーヒーミル',
                'condition' => '良好',
                'category' => json_encode(['キッチン']),
                'item_image' => 'storage/item_images/Waitress+with+Coffee+Grinder.jpg',
                'remain' => 1,
                'shop_id' => 4,
            ],
            [
                'user_id' => $userIds['tomomi.a@coachtech.com'] ?? 4, // ユーザー4のIDを使用
                'name' => 'メイクセット',
                'price' => 2500,
                'brand' => '',
                'explain' => '便利なメイクアップセット',
                'condition' => '目立った傷や汚れなし',
                'category' => json_encode(['レディース']),
                'item_image' => 'storage/item_images/外出メイクアップセット.jpg',
                'remain' => 1,
                'shop_id' => 4, // 💡 ここを追加
            ],
        ];

        DB::table('items')->insert($params);
    }
}

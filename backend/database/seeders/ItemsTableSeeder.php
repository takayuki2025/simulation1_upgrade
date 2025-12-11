<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Log ファサードを使用
use App\Models\User;
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
        // 既存データを削除
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('items')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // =============================================
        // 💡 修正箇所 1: shop_id に使う Shop レコードを ID 順にすべて取得
        // =============================================
        $shops = Shop::orderBy('id', 'asc')->pluck('id')->toArray();
        $numShops = count($shops);

        if ($numShops === 0) {
            Log::error("ItemsTableSeeder: No shops found. Seeding skipped.");
            return;
        }

        // =============================================
        // 💡 修正箇所 2: ユーザーIDをメールアドレスから動的に取得
        // =============================================
        $userEmails = [
            'valid.email@example.com',
            'taro.y@coachtech.com',
            'reina.n@coachtech.com',
            'tomomi.a@coachtech.com',
        ];

        $userIds = User::whereIn('email', $userEmails)
                       ->pluck('id', 'email')
                       ->toArray();

        // ユーザーIDが見つからない場合のフォールバック値（最初のユーザーID）
        $fallbackUserId = $userIds['valid.email@example.com'] ?? 1;

        // 商品データ。
        $params = [
            // shop_id が 1 のアイテム群
            [
                'user_id' => $userIds['valid.email@example.com'] ?? $fallbackUserId,
                'name' => '腕時計', 'price' => 15000, 'brand' => 'Rolax', 'explain' => 'スタイリッシュなデザインのメンズ腕時計',
                'condition' => '良好', 'category' => json_encode(['メンズ']), 'item_image' => 'storage/item_images/Armani+Mens+Clock.jpg',
                'remain' => 1, 'shop_id' => $shops[0] ?? 1,
            ],
            [
                'user_id' => $userIds['valid.email@example.com'] ?? $fallbackUserId,
                'name' => 'HDD', 'price' => 5000, 'brand' => '西芝', 'explain' => '高速で信頼性の高いハードディスク',
                'condition' => '目立った傷や汚れなし', 'category' => json_encode(['家電']), 'item_image' => 'storage/item_images/HDD+Hard+Disk.jpg',
                'remain' => 1, 'shop_id' => $shops[0] ?? 1,
            ],

            // shop_id が 2 のアイテム群
            [
                'user_id' => $userIds['taro.y@coachtech.com'] ?? $fallbackUserId,
                'name' => '玉ねぎ３束', 'price' => 300, 'brand' => 'なし', 'explain' => '新鮮な玉ねぎ3束のセット',
                'condition' => 'やや傷や汚れあり', 'category' => json_encode(['キッチン']), 'item_image' => 'storage/item_images/iLoveIMG+d.jpg',
                'remain' => 1, 'shop_id' => $shops[1] ?? 2,
            ],
            [
                'user_id' => $userIds['taro.y@coachtech.com'] ?? $fallbackUserId,
                'name' => '革靴', 'price' => 4000, 'brand' => '', 'explain' => 'クラシックなデザインの革靴',
                'condition' => '状態が悪い', 'category' => json_encode(['メンズ']), 'item_image' => 'storage/item_images/Leather+Shoes+Product+Photo.jpg',
                'remain' => 1, 'shop_id' => $shops[1] ?? 2,
            ],

            // shop_id が 3 のアイテム群
            [
                'user_id' => $userIds['reina.n@coachtech.com'] ?? $fallbackUserId,
                'name' => 'ノートPC', 'price' => 45000, 'brand' => '', 'explain' => '高性能なノートパソコン',
                'condition' => '良好', 'category' => json_encode(['家電']), 'item_image' => 'storage/item_images/Living+Room+Laptop.jpg',
                'remain' => 1, 'shop_id' => $shops[2] ?? 3,
            ],
            [
                'user_id' => $userIds['reina.n@coachtech.com'] ?? $fallbackUserId,
                'name' => 'マイク', 'price' => 8000, 'brand' => 'なし', 'explain' => '高音質のレコーディング用マイク',
                'condition' => '目立った傷や汚れなし', 'category' => json_encode(['家電']), 'item_image' => 'storage/item_images/Music+Mic+4632231.jpg',
                'remain' => 1, 'shop_id' => $shops[2] ?? 3,
            ],
            [
                'user_id' => $userIds['reina.n@coachtech.com'] ?? $fallbackUserId,
                'name' => 'ショルダーバッグ', 'price' => 3500, 'brand' => '', 'explain' => 'おしゃれなショルダーバッグ',
                'condition' => 'やや傷や汚れあり', 'category' => json_encode(['レディース']), 'item_image' => 'storage/item_images/Purse+fashion+pocket.jpg',
                'remain' => 1, 'shop_id' => $shops[2] ?? 3,
            ],

            // shop_id が 4 のアイテム群
            [
                'user_id' => $userIds['tomomi.a@coachtech.com'] ?? $fallbackUserId,
                'name' => 'タンブラー', 'price' => 500, 'brand' => 'なし', 'explain' => '使いやすいタンブラー',
                'condition' => '状態が悪い', 'category' => json_encode(['キッチン']), 'item_image' => 'storage/item_images/Tumbler+souvenir.jpg',
                'remain' => 1, 'shop_id' => $shops[3] ?? 4,
            ],
            [
                'user_id' => $userIds['tomomi.a@coachtech.com'] ?? $fallbackUserId,
                'name' => 'コーヒーミル', 'price' => 4000, 'brand' => 'Starbacks', 'explain' => '手動のコーヒーミル',
                'condition' => '良好', 'category' => json_encode(['キッチン']), 'item_image' => 'storage/item_images/Waitress+with+Coffee+Grinder.jpg',
                'remain' => 1, 'shop_id' => $shops[3] ?? 4,
            ],
            [
                'user_id' => $userIds['tomomi.a@coachtech.com'] ?? $fallbackUserId,
                'name' => 'メイクセット', 'price' => 2500, 'brand' => '', 'explain' => '便利なメイクアップセット',
                'condition' => '目立った傷や汚れなし', 'category' => json_encode(['レディース']), 'item_image' => 'storage/item_images/外出メイクアップセット.jpg',
                'remain' => 1, 'shop_id' => $shops[3] ?? 4,
            ],
        ];

        DB::table('items')->insert($params);
    }
}

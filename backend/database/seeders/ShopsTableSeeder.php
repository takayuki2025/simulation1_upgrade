<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ShopsTableSeeder extends Seeder
{
    public function run()
    {
        // ----------------------------------------------------
        // 1. shops テーブルを初期化
        // ----------------------------------------------------
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('shops')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // ----------------------------------------------------
        // 2. オーナーとなるユーザーを取得
        // ----------------------------------------------------
        $ownerUser = User::where('email', 'valid.email@example.com')->first();

        if (!$ownerUser) {
            Log::error("ShopsTableSeeder: Owner user not found. Shops cannot be created.");
            return;
        }

        // owner ロールIDの取得
        $ownerRole = Role::where('slug', 'owner')->first();

        if (!$ownerRole) {
            Log::error("ShopsTableSeeder: Role 'owner' not found.");
            return;
        }

        // ----------------------------------------------------
        // 3. ショップデータ
        // ----------------------------------------------------
        $shopsData = [
            [
                'owner_user_id' => $ownerUser->id,
                'name' => 'テストショップ A',
                'shop_code' => 'shop-a',
                'description' => '最新のフリマアイテムを取り扱う旗艦店です。',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'owner_user_id' => $ownerUser->id,
                'name' => 'テストショップ B',
                'shop_code' => 'shop-b',
                'description' => '家電・ガジェット専門店です。',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'owner_user_id' => $ownerUser->id,
                'name' => 'テストショップ C',
                'shop_code' => 'shop-c',
                'description' => 'ファッション・アクセサリーを専門に取り扱います。',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'owner_user_id' => $ownerUser->id,
                'name' => 'テストショップ D',
                'shop_code' => 'shop-d',
                'description' => '生活雑貨・キッチン用品の店です。',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // ----------------------------------------------------
        // 4. ショップ作成 ＋ オーナーに owner ロールを付与（ショップ別）
        // ----------------------------------------------------
        foreach ($shopsData as $shopData) {

            // shops テーブルに挿入して ID を取得
            $shopId = DB::table('shops')->insertGetId($shopData);

            // 🔥 店舗オーナーに owner ロールをショップ別で付与
            DB::table('role_user')->insert([
                'user_id' => $ownerUser->id,
                'role_id' => $ownerRole->id,
                'shop_id' => $shopId, // ← これが最重要
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        Log::info("ShopsTableSeeder: shops + owner role assignments completed.");
    }
}

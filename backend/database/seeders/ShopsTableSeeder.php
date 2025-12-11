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
    /**
     * Database seeds を実行します。
     *
     * @return void
     */
    public function run()
    {
        // データの重複を防ぐために、既存データを削除
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('shops')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. オーナーユーザーを検索するための準備
        $ownerRole = Role::where('slug', 'owner')->first();

        // UsersTableSeeder で作成した最も確実なオーナーユーザー（テスト用のユーザ１）をメールアドレスで取得
        $ownerUser = User::where('email', 'valid.email@example.com')->first();

        // フォールバック: ロールリレーションシップによる検索
        if (!$ownerUser && $ownerRole) {
            $ownerUser = User::whereHas('roles', function ($query) use ($ownerRole) {
                $query->where('role_id', $ownerRole->id);
            })->first();
        }

        if (!$ownerUser) {
            // ここで失敗した場合、UsersTableSeeder が失敗している
            Log::error("ShopsTableSeeder: Critical owner user not found. Shop seeding failed.");
            return;
        }

        // 2. 取得したオーナーユーザーに紐づけてショップを作成
        // ★ 修正ポイント: 外部キー名を 'owner_user_id' に修正し、4つのショップを作成
        $shopsData = [
            // ID 1: ItemsTableSeeder が参照する最初のショップ
            [
                'owner_user_id' => $ownerUser->id, // ✅ カラム名を 'owner_user_id' に修正
                'name' => 'テストショップ A',
                'shop_code' => 'shop-a',
                'description' => '最新のフリマアイテムを取り扱う旗艦店です。',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // ID 2
            [
                'owner_user_id' => $ownerUser->id, // ✅ カラム名を 'owner_user_id' に修正
                'name' => 'テストショップ B',
                'shop_code' => 'shop-b',
                'description' => '家電・ガジェット専門店です。',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // ID 3
            [
                'owner_user_id' => $ownerUser->id, // ✅ カラム名を 'owner_user_id' に修正
                'name' => 'テストショップ C',
                'shop_code' => 'shop-c',
                'description' => 'ファッション・アクセサリーを専門に取り扱います。',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // ID 4
            [
                'owner_user_id' => $ownerUser->id, // ✅ カラム名を 'owner_user_id' に修正
                'name' => 'テストショップ D',
                'shop_code' => 'shop-d',
                'description' => '生活雑貨・キッチン用品の店です。',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('shops')->insert($shopsData);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ShopsTableSeeder extends Seeder
{
    public function run(): void
    {
        // 1. OWNERユーザー一覧をID順に取得
        $owners = User::where('role', 'OWNER')
            ->orderBy('id')
            ->get();

        if ($owners->count() === 0) {
            \Log::error("ShopsTableSeeder: OWNER user not found.");
            return;
        }

        // 2. 作成したいショップ一覧
        $shopTemplates = [
            ['name' => 'ショップA', 'shop_code' => 'shop_a'],
            ['name' => 'ショップB', 'shop_code' => 'shop_b'],
            ['name' => 'ショップC', 'shop_code' => 'shop_c'],
            ['name' => 'ショップD', 'shop_code' => 'shop_d'],
        ];

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        foreach ($shopTemplates as $index => $tpl) {
            $owner = $owners[$index] ?? $owners[0]; // OWNER が足りなければ最初の人を使う

            $shopData = [
                'id' => $index + 1,
                'name' => $tpl['name'],
                'shop_code' => $tpl['shop_code'],
                'owner_user_id' => $owner->id,
                'status' => 'active',
                'description' => "{$tpl['name']} のデフォルト店舗",
                'created_at' => now(),
                'updated_at' => now()
            ];

            // ショップを作成/更新
            $shop = Shop::updateOrCreate(['id' => $shopData['id']], $shopData);

            // その OWNER に shop_id を付ける（重要🔥）
            $owner->update(['shop_id' => $shop->id]);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

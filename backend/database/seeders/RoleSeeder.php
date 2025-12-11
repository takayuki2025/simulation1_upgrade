<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            ['name' => 'Customer', 'slug' => 'customer'], // 👈 name を読みやすい名前に、slug をキーに変更
            ['name' => 'Shop Owner', 'slug' => 'owner'],
            ['name' => 'Shop Manager', 'slug' => 'manager'],
            ['name' => 'Shop Staff', 'slug' => 'staff'],

            ['name' => 'Top Shop Admin', 'slug' => 'top_shop_admin'],
            ['name' => 'Manager Admin', 'slug' => 'manager_admin'],
            ['name' => 'System Admin', 'slug' => 'admin'],

            ['name' => 'Developer', 'slug' => 'developer'],
        ];

        // タイムスタンプを追加
        $now = now();
        $rolesWithTimestamps = array_map(function ($role) use ($now) {
            return array_merge($role, [
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }, $roles);

        // 💡 データの重複を防ぐために、シーディング前に既存のデータを削除するか、
        // 独自のロジックで重複チェックを行う必要があります。

        // シンプルなDB::table('roles')->insert() を使用する場合、
        // 既存データを一度削除すると確実です。（truncateは外部キー制約に注意）

        // DB::table('roles')->truncate(); // 外部キー制約がある場合はエラーになります

        // 外部キー制約を無視して truncate を実行する（推奨）
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('roles')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // データ挿入
        DB::table('roles')->insert($rolesWithTimestamps);
    }
}

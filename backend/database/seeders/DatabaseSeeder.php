<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {


        $this->call([
            \Database\Seeders\RoleSeeder::class,
            // 1. 依存関係の少ないテーブルを先に作成（ユーザーテーブルが先）
            \Database\Seeders\UsersTableSeeder::class, // shop_id=nullでユーザーを作成
            \Database\Seeders\ShopsTableSeeder::class, // usersに依存しないショップを作成


            // 3. 他のシーダー
            \Database\Seeders\ItemsTableSeeder::class,
            // ...
        ]);

    }
}

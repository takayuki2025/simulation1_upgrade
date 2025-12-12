<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleUserSeeder extends Seeder
{
    public function run()
    {

        DB::table('role_user')->insert([
            ['user_id' => 1, 'role_id' => 2, 'shop_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => 2, 'role_id' => 2, 'shop_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => 3, 'role_id' => 2, 'shop_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => 4, 'role_id' => 2, 'shop_id' => 4, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}

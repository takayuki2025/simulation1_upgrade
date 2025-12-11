<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str; // Strをインポート
use App\Models\User;
use App\Models\Shop;
use App\Models\Role; // ★ Roleモデルをインポート
use Kreait\Firebase\Contract\Auth;

class UsersTableSeeder extends Seeder
{
    protected $firebaseAuth;

    public function __construct(Auth $firebaseAuth)
    {
        $this->firebaseAuth = $firebaseAuth;
    }

    public function run(): void
    {
        // 🚨 前提: RoleSeeder が先に実行され、'owner' ロールが存在すること。
        $ownerRole = Role::where('slug', 'owner')->first();
        if (!$ownerRole) {
            Log::error("UsersTableSeeder: 'owner' role not found. Cannot assign roles.");
            return;
        }

        // テストユーザーのリスト。
        // ★ ユーザー1をショップオーナーとして扱うため、ロール情報を付与（DBには挿入しないがロジックで使用）
        $testUsers = [
            [
                'name' => 'テスト用のユーザ１',
                'email' => 'valid.email@example.com',
                'password' => 'testtest1',
                'post_number' => '232-1332',
                'address' => '東京都港区芝公園4-2-8',
                'building' => 'コーポA',
                'address_country' => 'JP',
                'shop_id' => null, // shop_id は ShopsTableSeeder で設定されるため、ここでは null
                'target_role' => 'owner', // ★ 追加: 割り当てたいロールを定義
            ],
            [
                'name' => 'テスト用のユーザ2',
                'email' => 'taro.y@coachtech.com',
                'password' => 'testtest2',
                'post_number' => '232-1355',
                'address' => '千葉',
                'building' => 'ハイツB',
                'address_country' => 'JP',
                'shop_id' => null,
                'target_role' => 'owner', // ★ 追加
            ],
            [
                'name' => 'テスト用のユーザ3',
                'email' => 'reina.n@coachtech.com',
                'password' => 'testtest3',
                'post_number' => '232-1377',
                'address' => '静岡',
                'building' => 'エトワール',
                'address_country' => 'JP',
                'shop_id' => null,
                'target_role' => 'owner', // ★ 追加
            ],
            [
                'name' => 'テスト用のユーザ4',
                'email' => 'tomomi.a@coachtech.com',
                'password' => 'testtest4',
                'post_number' => '232-1399',
                'address' => '長野',
                'building' => 'エスポワール',
                'address_country' => 'JP',
                'shop_id' => null,
                'target_role' => 'owner', // ★ 追加
            ],
        ];

        // DBから既存ユーザーを強制削除
        $emailsToCleanup = array_column($testUsers, 'email');
        User::whereIn('email', $emailsToCleanup)->delete();

        foreach ($testUsers as $userData) {
            $email = $userData['email'];
            $password = $userData['password'];
            $roleSlug = $userData['target_role'];

            try {
                // 1. Firebase Auth ユーザーを作成（既存なら削除して再作成）
                try {
                    $userRecord = $this->firebaseAuth->getUserByEmail($email);
                    $this->firebaseAuth->deleteUser($userRecord->uid);
                } catch (\Exception $e) {
                    // ユーザーが存在しなかった場合は無視
                }

                $userRecord = $this->firebaseAuth->createUser([
                    'email' => $email,
                    'emailVerified' => true,
                    'password' => $password,
                    'displayName' => $userData['name'],
                ]);

                // 2. Laravel データベースにユーザー情報を同期/作成
                $user = User::updateOrCreate( // updateOrCreate の戻り値を受け取る
                    ['firebase_uid' => $userRecord->uid],
                    [
                        'name' => $userData['name'],
                        'email' => $email,
                        'password' => Hash::make(Str::random(16)), // Str::randomを使用
                        'post_number' => $userData['post_number'],
                        'address' => $userData['address'],
                        'building' => $userData['building'],
                        'address_country' => $userData['address_country'],
                        'user_image' => '',
                        'shop_id' => $userData['shop_id'],
                        'email_verified_at' => now(),
                    ]
                );

                // 3. ★★★ ロール割り当てロジックの追加 ★★★
                $targetRole = Role::where('slug', $roleSlug)->first();
                if ($targetRole && !$user->roles()->where('role_id', $targetRole->id)->exists()) {
                    // role_user テーブルにレコードを挿入
                    // shop_id はまだ不明のため null で attach
                    $user->roles()->attach($targetRole->id);
                }
                // ★★★ ------------------------------- ★★★

                Log::info("Firebase and MySQL synchronized for user: " . $email);

            } catch (\Exception $e) {
                Log::error("Failed to sync user ($email) with Firebase: " . $e->getMessage());
                throw $e;
            }
        }
    }
}

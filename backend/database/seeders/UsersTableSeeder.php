<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Shop;
use Kreait\Firebase\Contract\Auth;

class UsersTableSeeder extends Seeder
{
    protected $firebaseAuth;

    /**
     * Firebase Auth サービスを依存性の注入(DI)で受け取ります。
     */
    public function __construct(Auth $firebaseAuth)
    {
        $this->firebaseAuth = $firebaseAuth;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        // =============================================
        // 💡 修正箇所: shop_id に使う Shop レコードを取得する
        // =============================================
        // $shop = Shop::first();

        // ⚠️ 注意: $shop が null でないか確認するか、
        // DatabaseSeeder.php で ShopsTableSeeder が先に実行されているか確認してください。

        // if (!$shop) {
        //     // ショップが存在しない場合はエラーを出すか、処理をスキップするなどの対応が必要です。
        //     // ここでは一旦、続行するために処理を止めます。
        //     \Log::error("UsersTableSeeder: Shop record not found. Cannot set shop_id.");
        //     return;
        // }

        // テストユーザーのリスト。パスワードは全ユーザー共通で 'password123' とします。
        $testUsers = [
            [
                'name' => 'テスト用のユーザ１',
                'email' => 'valid.email@example.com',
                'password' => 'testtest1', // Firebase用の一時的な平文パスワード
                'post_number' => '232-1332',
                'address' => '東京都港区芝公園4-2-8',
                'building' => 'コーポA',
                'address_country' => 'JP',
                'shop_id' => null,
                // 💡 修正
                'role' => 'OWNER',
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
                // 💡 修正
                'role' => 'OWNER',
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
                // 💡 修正
                'role' => 'OWNER',
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
                // 💡 修正
                'role' => 'OWNER',
            ],

        ];

        // 🚨 【修正ポイント１：DBからの強力なクリーンアップ】
        // シード実行前に、メールアドレスに基づいてDBから既存ユーザーを強制削除します。
        // これにより、UniqueConstraintViolationException の発生を回避します。
        $emailsToCleanup = array_column($testUsers, 'email');
        User::whereIn('email', $emailsToCleanup)->delete();
        // ---------------------------------------------------------------------

        foreach ($testUsers as $userData) {
            $email = $userData['email'];
            $password = $userData['password'];

            // 1. Firebase Auth ユーザーを作成（既存なら削除して再作成）
            try {
                // クリーンアップ: Firebase Auth から既存ユーザーを削除
                try {
                    $userRecord = $this->firebaseAuth->getUserByEmail($email);
                    $this->firebaseAuth->deleteUser($userRecord->uid);

                    // 削除時は email ではなく firebase_uid で検索
                    // User::where('firebase_uid', $userRecord->uid)->delete();
                    // ↑ 既に run() の冒頭でメールアドレスをキーに削除済みのためこの行は不要
                } catch (\Exception $e) {
                    // ユーザーが存在しなかった場合は無視
                }

                // 新規テストユーザーの作成
                $userRecord = $this->firebaseAuth->createUser([
                    'email' => $email,
                    'emailVerified' => true,
                    'password' => $password,
                    'displayName' => $userData['name'],
                ]);

                // 2. Laravel データベースにユーザー情報を同期/作成
                User::updateOrCreate(
                    ['firebase_uid' => $userRecord->uid],
                    [
                        'name' => $userData['name'],
                        'email' => $email,
                        // Laravel DBのパスワードはNOT NULL制約回避のためランダム文字列を設定
                        'password' => Hash::make(\Illuminate\Support\Str::random(16)),
                        'post_number' => $userData['post_number'],
                        'address' => $userData['address'],
                        'building' => $userData['building'],
                        'address_country' => $userData['address_country'],
                        'user_image' => '', // 必要に応じて設定
                        'shop_id' => $userData['shop_id'],
                        'role' => $userData['role'],
                        'email_verified_at' => now(),
                    ]
                );

                Log::info("Firebase and MySQL synchronized for user: " . $email);

            } catch (\Exception $e) {
                // Firebaseクレデンシャルなどの設定エラーの可能性が高い
                Log::error("Failed to sync user ($email) with Firebase: " . $e->getMessage());
                // エラーが発生した場合は強制的に処理を終了し、DBを汚染しないようにする
                throw $e;
            }
        }
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            /* ============================================================
               🔐 Firebase & Laravel Auth 統合
            ============================================================ */
            $table->string('firebase_uid')->unique()->nullable()
                ->comment('Firebase UID（Firebaseログイン時に必須）');

            /* ============================================================
               🏪 マルチテナント（店舗紐づけ可能）
            ============================================================ */
            $table->foreignId('shop_id')
                ->nullable()
                ->comment('所属店舗。null の場合はフリマ利用者');

            /* ============================================================
               👤 基本プロフィール
            ============================================================ */
            $table->string('name', 255);
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();

            // Laravel パスワード（Firebaseログイン時は使わないが必要）
            $table->string('password');

            /* ============================================================
               🏠 住所情報
            ============================================================ */
            $table->string('post_number')->nullable();
            $table->string('address')->nullable();
            $table->string('building')->nullable();
            $table->string('address_country')->nullable();

            /* ============================================================
               🖼 プロフィール画像
            ============================================================ */
            $table->string('user_image')->nullable();

            /* ============================================================
               ⚠️ 旧 role カラム（削除推奨）
               → role_user テーブルで管理するので不要
            ============================================================ */
            // $table->string('role')->nullable(); // ❌ 今後不要 → 残すなら nullable にすべき

            /* ============================================================
               🔐 Laravel 標準
            ============================================================ */
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
}

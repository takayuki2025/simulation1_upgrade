<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();


            // ⭐ マルチ店舗対応のためここに shop_id を追加します
            // $table->foreignId('shop_id')->constrained() は、
            // 1. shop_id という名前の UNSIGNED BIGINT カラムを作成
            // 2. shops テーブルの id カラムへの外部キー制約 (foreign key constraint) を設定
            $table->foreignId('shop_id')->nullable(); // 💡 ここを追加
    //   ->constrained()
    //   ->cascadeOnDelete();//->constrained()->cascadeOnDelete()

            $table->string('name', 20);
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('post_number')->nullable();
            $table->string('address')->nullable();
            $table->string('building')->nullable();
            $table->string('user_image')->nullable();
            $table->string('address_country')->nullable();
            $table->string('role');
            $table->rememberToken();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        // Schema::table('users', function (Blueprint $table) {
        //     $table->boolean('first_time_access')->nullable(false)->default(false)->change();
        // });

        // 🚨 注意: down() メソッドは、up() で行った変更を元に戻すために使用されます。
        // Schema::create の場合、down() ではテーブル全体を削除するのが一般的です。
        // ご提示の down() の内容は、このファイルで行った変更を完全に元に戻しません。

        // 以下のように、テーブル削除に修正することを強く推奨します。
        Schema::dropIfExists('users');

    }
}

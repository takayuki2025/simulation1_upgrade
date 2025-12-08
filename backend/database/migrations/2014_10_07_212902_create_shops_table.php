<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->id();

            // 店舗名
            $table->string('name', 50);

            // 店舗コード（短い識別子で URL や API に使う）
            $table->string('shop_code', 30)->unique();

            // 店舗のオーナーとなるユーザー
            $table->foreignId('owner_user_id')->nullable();
            // ->constrained('users');
            // ->constrained('users')->cascadeOnDelete();

            // 店舗ステータス
            $table->enum('status', ['active', 'inactive'])->default('active');


            $table->string('banner_url')->nullable();


            // 任意の説明文
            $table->string('description')->nullable();

            // 店舗ロゴ
            $table->string('logo')->nullable();


            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};

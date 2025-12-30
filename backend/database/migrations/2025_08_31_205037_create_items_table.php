<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();

            // 店舗出品のみ入る
            $table->foreignId('shop_id')
                ->nullable()
                ->constrained('shops')
                ->nullOnDelete();

            // 出品したユーザー（個人・店舗共通）
            $table->foreignId('created_by_user_id')
                ->nullable()
                ->constrained('users') // ← ★ここが重要
                ->nullOnDelete();

            $table->string('name', 20);
            $table->integer('price');
            $table->string('brand', 20)->nullable();
            $table->string('explain', 255);
            $table->string('condition', 20);
            $table->json('category');
            $table->string('item_image')->nullable();
            $table->integer('remain');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('items');
    }
}

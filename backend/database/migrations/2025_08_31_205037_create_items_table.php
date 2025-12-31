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

            /**
             * 出品起源（★最重要）
             */
            $table->enum('item_origin', [
                'USER_PERSONAL',   // 個人出品
                'SHOP_MANAGED',    // ショップ / 運営管理下商品（Seeder含む）
            ]);

            /**
             * ショップに属する場合のみ入る
             * SHOP_MANAGED でも将来 null の可能性があるため nullable
             */
            $table->foreignId('shop_id')
                ->nullable()
                ->constrained('shops')
                ->nullOnDelete();

            /**
             * 個人出品者
             * USER_PERSONAL のみ入る
             */
            $table->foreignId('created_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // 商品情報
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

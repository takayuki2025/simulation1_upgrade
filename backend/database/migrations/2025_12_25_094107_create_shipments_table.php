<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();

            // Order との 1:1 関係
            $table->unsignedBigInteger('order_id')->unique();

            // 配送状態（v1 は文字列で十分）
            $table->string('status', 32);

            // 到着予定（nullable）
            $table->dateTime('eta')->nullable();

            $table->timestamps();

            // 将来 v2 のための最低限の整合性
            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};

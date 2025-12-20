<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('item_entities', function (Blueprint $table) {
            $table->id();

            // 1 item : 1 entity snapshot（v1）
            $table->unsignedBigInteger('item_id')->unique();

            // entities（v1 は ID のみ・FK なし）
            $table->unsignedBigInteger('brand_entity_id')->nullable();
            $table->unsignedBigInteger('condition_entity_id')->nullable();
            $table->unsignedBigInteger('color_entity_id')->nullable();

            // meta
            $table->string('generated_version')->default('v1');
            $table->timestamp('generated_at')->nullable();

            $table->timestamps();

            // FK（v1 では brand のみ）
            $table->foreign('item_id')
                ->references('id')->on('items')->cascadeOnDelete();

            $table->foreign('brand_entity_id')
                ->references('id')->on('brand_entities')->nullOnDelete();

            // indexes
            $table->index('brand_entity_id');
            $table->index('condition_entity_id');
            $table->index('color_entity_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_entities');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('item_entities', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('item_id')->unique(); // 1:1
            $table->unsignedBigInteger('brand_entity_id')->nullable();

            $table->string('generated_version')->default('v1_brand_only');
            $table->timestamp('generated_at');

            $table->timestamps();

            $table->foreign('item_id')->references('id')->on('items')->cascadeOnDelete();
            $table->foreign('brand_entity_id')->references('id')->on('brand_entities')->nullOnDelete();

            $table->index('brand_entity_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_entities');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('brand_entities', function (Blueprint $table) {
            $table->id();
            $table->string('canonical_name');
            $table->string('normalized_key')->unique();
            $table->json('synonyms_json')->nullable();
            $table->decimal('confidence', 3, 2)->default(1.00); // 0.00 - 9.99
            $table->string('created_from')->default('manual'); // manual / inferred
            $table->timestamps();

            $table->index('canonical_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brand_entities');
    }
};


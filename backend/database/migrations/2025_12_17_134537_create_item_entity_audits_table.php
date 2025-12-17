<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('item_entity_audits', function (Blueprint $table) {
            $table->id();

            $table->foreignId('item_entity_id')
                ->constrained('item_entities')
                ->cascadeOnDelete();

            $table->string('decision', 50);
            $table->float('confidence');

            $table->json('payload'); // AtlasKernel output 丸ごと（不変ログ）
            $table->timestamps();

            $table->index(['item_entity_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_entity_audits');
    }
};

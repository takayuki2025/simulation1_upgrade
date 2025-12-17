<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('item_entities', function (Blueprint $table) {
            $table->id();

            $table->foreignId('item_id')
                ->constrained('items')
                ->cascadeOnDelete();

            $table->string('entity_type', 50);      // brand/category/condition/document_term...
            $table->text('raw_value');
            $table->text('canonical_value');

            $table->float('confidence');            // 0.0 - 1.0
            $table->string('decision', 50);         // auto_accept/needs_review/rejected

            $table->string('policy_version', 50)->nullable(); // decision_policy.v1 等
            $table->string('schema_version', 50);   // entity_analysis.v1
            $table->string('engine_version', 50);   // 0.1.0

            $table->json('extensions')->nullable(); // policy_trace/escalation...

            $table->timestamps();

            $table->index(['item_id', 'entity_type']);
            $table->index(['entity_type', 'decision']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_entities');
    }
};

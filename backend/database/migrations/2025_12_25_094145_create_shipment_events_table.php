<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('shipment_events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shipment_id')->index();
            $table->string('type', 100);
            $table->json('payload')->nullable();

            $table->timestamp('occurred_at')->index();

            $table->timestamps();

            $table->foreign('shipment_id')
                  ->references('id')
                  ->on('shipments')
                  ->cascadeOnDelete();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipment_events');
    }
};

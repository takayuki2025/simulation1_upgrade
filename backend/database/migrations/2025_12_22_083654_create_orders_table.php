<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Multi-tenant / shop scope
            $table->unsignedBigInteger('shop_id')->index();

            // Buyer
            $table->unsignedBigInteger('user_id')->index();

            // Status
            $table->string('status', 50)->index(); // pending_payment, paid, cancelled, payment_failed, expired

            // Totals (snapshot)
            $table->unsignedInteger('total_amount');
            $table->string('currency', 10);

            // Snapshot of ordered items (JSON)
            $table->json('items_snapshot');

            // Optional metadata for future
            $table->json('meta')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

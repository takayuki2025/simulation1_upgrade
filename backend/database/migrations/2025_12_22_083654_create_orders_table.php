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


            $table->string('shipping_postal_code', 20)->nullable();
            $table->string('shipping_prefecture', 50)->nullable();
            $table->string('shipping_city', 100)->nullable();
            $table->string('shipping_address_line1', 255)->nullable();
            $table->string('shipping_address_line2', 255)->nullable();
            $table->string('shipping_recipient_name', 100)->nullable();
            $table->string('shipping_phone', 30)->nullable();
            $table->timestamp('address_snapshot_at')->nullable();


            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

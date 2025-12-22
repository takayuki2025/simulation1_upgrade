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


        Schema::create('shop_ledgers', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('shop_id')->index();

            // sale | refund | fee | payout | adjustment
            $table->string('type', 32)->index();

            // ✅ signed amount（売上:+ / 返金・手数料:-）
            $table->integer('amount');

            $table->string('currency', 10);

            $table->unsignedBigInteger('order_id')->nullable()->index();
            $table->unsignedBigInteger('payment_id')->nullable()->index();

            $table->json('meta')->nullable();

            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_ledgers');
    }
};

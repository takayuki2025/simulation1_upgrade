<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('item_drafts', function (Blueprint $table) {
    $table->uuid('id')->primary();

    $table->foreignId('user_id')
        ->nullable()
        ->constrained('users')
        ->cascadeOnDelete();

    $table->foreignId('shop_id')
        ->nullable()
        ->constrained('shops')
        ->cascadeOnDelete();

    $table->string('name', 255);
    $table->integer('price'); // JPY only (minor unit)
    $table->string('brand', 255)->nullable();

    $table->string('item_image')->nullable(); // Draft image path
    $table->string('explain')->nullable();
    $table->string('condition')->nullable();
    $table->json('category')->nullable(); // Draft raw categories
    $table->integer('remain')->default(1);

    $table->string('status', 20); // draft / published
    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('item_drafts');
    }
};
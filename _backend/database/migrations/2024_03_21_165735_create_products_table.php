<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description'); 
            $table->decimal('value', 10, 2); // 10 dígitos no total, 2 dígitos após o ponto decimal
            $table->unsignedBigInteger('human_id')->nullable();
            $table->unsignedBigInteger('material_id')->nullable();
            $table->foreign('human_id')->references('id')->on('human_resources');
            $table->foreign('material_id')->references('id')->on('material_resources');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

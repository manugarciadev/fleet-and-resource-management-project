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
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('legal_name');
            $table->string('logo');
            $table->string('public_name');
            $table->boolean('status')->default(false);
            $table->string('description');
            $table->json('website_and_social_media')->nullable(); // Adicionando a coluna JSON
            $table->string('street_address');
            $table->string('city');
            $table->string('postal_code');
            $table->string('state_region')->nullable();
            $table->string('country_code')->nullable(); // Código do país
            $table->string('mobile_phone')->nullable(); // Número de telefone
            $table->string('emergency_phone_number')->nullable();
            $table->string('email');
            $table->string('company_registration_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};

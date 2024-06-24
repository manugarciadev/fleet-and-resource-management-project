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
        Schema::create('payment_and_tax_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id')->unique();
            $table->integer('vat_number');
            $table->string('contry_of_issue');
            $table->integer('tax_number');
            $table->string('tin_country_of_issue');
            $table->boolean('payment_data_status')->default(false);  // Coluna 'status' como boolean com valor padrão false
            $table->string('payment_method');
            $table->string('payment_frequency');
            $table->decimal('commission_rate', 5, 2); // Armazenar a porcentagem como decimal
            $table->string('currency');
            $table->foreign('invoice_id')->references('id')->on('invoices');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_and_tax_details');
    }
};

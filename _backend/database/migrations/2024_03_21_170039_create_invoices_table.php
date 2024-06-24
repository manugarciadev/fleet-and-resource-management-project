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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bookingForPayouts_id');
            $table->integer('invoice_number');
            $table->date('issue_date');
            $table->date('due_date');
            $table->string('period');
            $table->decimal('value', 10, 2); // 10 dígitos no total, 2 dígitos após o ponto decimal
            $table->foreign('bookingForPayouts_id')->references('id')->on('booking_for_payouts');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};

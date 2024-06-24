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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->integer('code');
            $table->string('description');
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('status')->default(false);  // Coluna 'status' como boolean com valor padrão false
            $table->unsignedBigInteger('type_id');
            $table->unsignedBigInteger('signature_id');
            $table->unsignedBigInteger('partner_id')->nullable();
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->foreign('type_id')->references('id')->on('contract_types');
            $table->foreign('signature_id')->references('id')->on('subscriptions');
            $table->foreign('partner_id')->references('id')->on('partners');
            $table->foreign('employee_id')->references('id')->on('employees');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};

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
        Schema::create('batch_billings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_plan_id')->constrained('customer_plans');
            $table->string('bill_no');
            $table->decimal('bill_amount', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_billings');
    }
};

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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_plan_id')->constrained('customer_plans');
            $table->string('bill_no');
            $table->decimal('rebate', 10, 2)->default(0.00);
            $table->decimal('partial', 10, 2)->default(0.00);
            $table->decimal('bill_amount', 10, 2);
            $table->enum('description', ['n/a','january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 
            'october', 'november', 'december']);
            $table->enum('mode_payment', ['N/A', 'cash', 'gcash']);
            $table->enum('remarks', ['advance', 'batch']);
            $table->enum('status', ['paid', 'unpaid']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

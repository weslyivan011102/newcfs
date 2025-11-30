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
        Schema::table('customer_plans', function (Blueprint $table) {
            $table->enum('date_billing', ['batch1', 'batch2'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_plans', function (Blueprint $table) {
            $table->date('date_billing')->change();
        });
    }
};

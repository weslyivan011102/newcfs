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
        Schema::table('transactions', function (Blueprint $table) {
             // Add the collector_id column as an unsigned bigint
            $table->unsignedBigInteger('collector_id')->nullable();

            // Set up the foreign key constraint
            $table->foreign('collector_id')
                  ->references('id')->on('collectors')
                  ->onDelete('set null'); // Set to null if the referenced collector is deleted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['collector_id']);
            $table->dropColumn('collector_id');
        });
    }
};

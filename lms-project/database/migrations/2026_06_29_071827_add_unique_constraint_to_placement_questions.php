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
       Schema::table('placement_questions', function (Blueprint $table) {
    $table->unique(['test_code', 'question_number']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('placement_questions', function (Blueprint $table) {
    $table->dropUnique(['test_code', 'question_number']);
});
    }
};

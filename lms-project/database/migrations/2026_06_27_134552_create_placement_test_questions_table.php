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
       Schema::create('placement_test_questions', function (Blueprint $table) {
    $table->id();

    $table->foreignId('placement_test_id')
        ->constrained('placement_tests')
        ->cascadeOnDelete();

    $table->foreignId('placement_question_id')
        ->constrained('placement_questions')
        ->cascadeOnDelete();

    $table->unsignedInteger('display_order');

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placement_test_questions');
    }
};

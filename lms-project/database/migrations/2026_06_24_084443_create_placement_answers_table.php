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
       Schema::create('placement_answers', function (Blueprint $table) {
    $table->id();

    $table->foreignId('placement_test_id')
        ->constrained('placement_tests')
        ->cascadeOnDelete();

    $table->foreignId('question_id')
        ->constrained('placement_questions')
        ->cascadeOnDelete();

    $table->longText('answer_text')->nullable();

    $table->integer('score')->nullable();

    $table->text('reviewer_notes')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placement_answers');
    }
};

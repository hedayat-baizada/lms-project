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
       Schema::create('placement_questions', function (Blueprint $table) {
    $table->id();

    $table->string('course_track');
    // A2, A3, A4, A5, A6, Intermediate, Advanced

    $table->unsignedBigInteger('level_id')->nullable();

    $table->text('question_text');

    $table->string('question_type')->default('text');
    // mcq, text, paragraph

    $table->integer('marks')->default(1);

    $table->string('status')->default('active');

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placement_questions');
    }
};

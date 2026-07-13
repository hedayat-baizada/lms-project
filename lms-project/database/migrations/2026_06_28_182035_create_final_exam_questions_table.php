<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('final_exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('final_exam_id')->constrained()->onDelete('cascade');
            $table->text('question');
            $table->integer('order');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('final_exam_questions');
    }
};
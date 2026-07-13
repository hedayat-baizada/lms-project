<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained()->onDelete('cascade');
            $table->boolean('video_watched')->default(false);
            $table->boolean('homework_submitted')->default(false);
            $table->boolean('is_unlocked')->default(false);
            $table->timestamp('video_watched_at')->nullable();
            $table->timestamp('unlocked_at')->nullable();
            $table->unique(['user_id', 'lesson_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_lesson_progress');
    }
};
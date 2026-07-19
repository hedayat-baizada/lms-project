<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('teacher_note')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->unique(['user_id', 'lesson_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_requests');
    }
};
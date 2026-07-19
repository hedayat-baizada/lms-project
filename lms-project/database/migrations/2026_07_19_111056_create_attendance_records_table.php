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
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
             $table->foreignId('class_session_id')
                ->constrained('class_sessions')
                ->cascadeOnDelete();

            $table->foreignId('student_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->enum('status', [
                'present',
                'absent',
                'late',
                'excused',
                'left_early'
            ]);

            $table->text('note')->nullable();

            $table->foreignId('marked_by')
                ->constrained('teachers');

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('teachers')
                ->nullOnDelete();

            $table->timestamps();

            $table->unique([
                'class_session_id',
                'student_id'
            ]);

            $table->index([
                'student_id',
                'status'
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};

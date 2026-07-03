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
        Schema::create('attendancerecord', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attendancesession_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('student_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('status', [
                'present',
                'absent',
                'late',
                'excused'
            ]);
             $table->foreign('is_holiday');
            $table->foreignId('marked_by')
                ->constrained('users');

            $table->unsignedInteger('absence_count');
            $table->timestamps();
            $table->unique([
                'attendance_session_id',
                'student_id'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendancerecord');
    }
};

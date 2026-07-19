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
        Schema::create('attendace_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            // Class
            $table->foreignId('class_id')
                ->constrained('student_classes')
                ->cascadeOnDelete();

            // Attendance period
            $table->enum('attendance_period', [
                'weekly',
                'biweekly',
                'monthly',
            ]);

            // Period dates
            $table->date('period_start');
            $table->date('period_end');

            // Statistics
            $table->unsignedSmallInteger('total_school_days')->default(0);

            $table->unsignedSmallInteger('present_days')->default(0);

            $table->unsignedSmallInteger('absent_days')->default(0);

            $table->unsignedSmallInteger('late_days')->default(0);

            $table->unsignedSmallInteger('excused_days')->default(0);

            // Percentage
            $table->decimal('attendance_percentage', 5, 2)->default(0.00);

            // When this summary was generated
            $table->timestamp('last_calculated_at')->nullable();

            $table->timestamps();

            // One summary per student, class and period
            $table->unique([
                'student_id',
                'class_id',
                'attendance_period',
                'period_start'
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendace_summaries');
    }
};

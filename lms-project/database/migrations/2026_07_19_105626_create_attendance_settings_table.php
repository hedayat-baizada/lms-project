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
        Schema::create('attendance_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_rooms_id')
                ->constrained()
                ->cascadeOnDelete();

            // Attendance period length
            $table->unsignedTinyInteger('period_days')
                ->default(7)
                ->comment('7 = Weekly, 14 = Biweekly, 30 = Monthly');

            // Notification thresholds
            $table->unsignedTinyInteger('teacher_warning_after')
                ->default(2);

            $table->unsignedTinyInteger('admin_warning_after')
                ->default(3);

            // Friday is off by default
            $table->boolean('friday_off')->default(true);

            // Enable / Disable attendance
            $table->boolean('is_active')->default(true);

            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_settings');
    }
};

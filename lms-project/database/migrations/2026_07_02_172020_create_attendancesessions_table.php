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
        Schema::create('attendancesessions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('class_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('teacher_id')
                ->constrained();

            $table->date('attendance_date');

            $table->timestamp('started_at');
           

            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
             $table->unique(['class_id', 'attendance_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendancesessions');
    }
};

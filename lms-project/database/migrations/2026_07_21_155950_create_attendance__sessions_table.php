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
        Schema::create('attendance__sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_room_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('teacher_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->date('lesson_date');

            $table->time('start_time');

            $table->time('end_time');

            $table->enum('lesson_type',[
                'zoom',
                'platform'
            ]);

            $table->string('meeting_link')->nullable();

            $table->boolean('attendance_locked')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance__sessions');
    }
};

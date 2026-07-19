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
        Schema::create('class__sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attendance_period_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->date('session_date');

            $table->time('start_time')->nullable();

            $table->time('end_time')->nullable();

            $table->enum('delivery_mode', [
                'zoom',
                'platform',
                'offline'
            ]);

            $table->string('meeting_link')->nullable();

            $table->boolean('is_holiday')->default(false);

            $table->text('description')->nullable();

            $table->timestamps();

            $table->unique([
                'attendance_period_id',
                'session_date'
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class__sessions');
    }
};

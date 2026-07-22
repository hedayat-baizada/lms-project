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
        Schema::create('attendance__holidays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_room_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->date('holiday_date');

            $table->string('title');

            $table->text('reason')->nullable();

            $table->foreignId('teacher_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance__holidays');
    }
};

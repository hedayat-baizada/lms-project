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
        Schema::create('attendance__settings', function (Blueprint $table) {
            $table->id();
               $table->foreignId('class_room_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->boolean('attendance_enabled')->default(true);

            // Weekly / Monthly etc.
            $table->enum('attendance_period',[
                'weekly',
                'biweekly',
                'monthly'
            ])->default('weekly');

            $table->boolean('friday_off')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance__settings');
    }
};

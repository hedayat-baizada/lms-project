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
             $table->foreignId('attendance_period_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->date('holiday_date');

            $table->string('reason')->nullable();

            $table->timestamps();

            $table->unique([
                'attendance_period_id',
                'holiday_date'
            ]);
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

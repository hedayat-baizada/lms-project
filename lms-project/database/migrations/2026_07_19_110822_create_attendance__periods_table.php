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
        Schema::create('attendance__periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_rooms_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('teacher_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->date('start_date');

            $table->date('end_date');

            $table->enum('status', [
                'draft',
                'active',
                'completed'
            ])->default('draft');

            $table->timestamps();

            $table->index([
                'class_id',
                'teacher_id'
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance__periods');
    }
};

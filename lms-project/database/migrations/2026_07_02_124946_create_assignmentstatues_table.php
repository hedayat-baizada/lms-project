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
        Schema::create('assignmentstatues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')
                ->constrained();
               

            $table->foreignId('student_id')
                ->constrained();
                
            $table->foreignId('class_id')
                ->constrained();
            $table->enum('status', [
                'completed',
                'not_completed',
                'late',
                'excused'
            ])->default('not_completed');

            $table->foreignId('checked_by')
                ->nullable()
                ->constrained();

            $table->dateTime('checked_at')
                ->nullable();


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignmentstatues');
    }
};

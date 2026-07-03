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
        Schema::create('classassignment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')
                ->constrained();
                

            $table->foreignId('teacher_id')
                ->constrained();
                

            $table->foreignId('subject_id')
                ->constrained();
                

            $table->string('title');

            $table->text('description');

            $table->date('assigned_date');

            $table->date('due_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classassignment');
    }
};

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
        Schema::create('myclss', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')
                ->constrained();
                

            $table->foreignId('class_id')
                ->constrained();
                

            $table->foreignId('subject_id')
                ->constrained();
                

            $table->date('assigned_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('myclss');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('placement_levels', function (Blueprint $table) {
            $table->id();

            $table->string('program');
            // prep_cel
            // cel

            $table->string('level_code');
            // A1
            // A2
            // Intermediate
            // Advanced

            $table->string('display_name');

            $table->integer('display_order')->default(1);

            $table->boolean('active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('placement_levels');
    }
};
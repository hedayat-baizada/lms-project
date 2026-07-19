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
        Schema::create('team_review_actions', function (Blueprint $table) {
    $table->id();

    $table->foreignId('team_application_id')
        ->constrained('team_applications')
        ->cascadeOnDelete();

    $table->foreignId('reviewer_id')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();

    $table->string('action');
    // approved, rejected, need_correction

    $table->text('notes')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_review_actions');
    }
};

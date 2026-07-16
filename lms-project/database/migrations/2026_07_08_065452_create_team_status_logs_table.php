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
        Schema::create('team_status_logs', function (Blueprint $table) {
    $table->id();

    $table->foreignId('team_application_id')
        ->constrained('team_applications')
        ->cascadeOnDelete();

    $table->string('old_status')->nullable();
    $table->string('new_status');

    $table->foreignId('changed_by')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();

    $table->text('notes')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_status_logs');
    }
};

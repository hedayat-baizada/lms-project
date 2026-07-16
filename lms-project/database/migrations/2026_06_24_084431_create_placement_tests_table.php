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
        Schema::create('placement_tests', function (Blueprint $table) {
    $table->id();

    $table->foreignId('application_id')
        ->constrained('applications')
        ->cascadeOnDelete();

    $table->string('test_type');
    // prep_cel or cel

    $table->boolean('is_required')->default(true);

    $table->string('status')->default('pending');

    $table->integer('written_score')->nullable();
    $table->integer('speaking_score')->nullable();
    $table->integer('total_score')->nullable();

    $table->text('reviewer_notes')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placement_tests');
    }
};

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
       Schema::create('verification_checks', function (Blueprint $table) {
    $table->id();

    $table->foreignId('application_id')
        ->constrained('applications')
        ->cascadeOnDelete();

    $table->foreignId('checked_by')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();

    $table->string('document_status')->default('pending');
    $table->string('personal_info_status')->default('pending');
    $table->string('test_status')->default('pending');
    $table->string('speaking_status')->default('pending');
    $table->string('overall_status')->default('pending');

    $table->text('notes')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verification_checks');
    }
};

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
       Schema::create('application_documents', function (Blueprint $table) {
    $table->id();

    $table->foreignId('application_id')
        ->constrained('applications')
        ->cascadeOnDelete();

    $table->string('document_owner_type'); 
    // applicant or guardian

    $table->string('document_type'); 
    // tazkira, unhcr, por, other

    $table->string('document_name')->nullable();
    $table->string('document_number')->nullable();
    $table->string('file_path');

    $table->string('status')->default('pending');
    $table->text('reviewer_notes')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_documents');
    }
};

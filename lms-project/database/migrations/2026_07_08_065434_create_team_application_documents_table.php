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
       Schema::create('team_application_documents', function (Blueprint $table) {
    $table->id();

    $table->foreignId('team_application_id')
        ->constrained('team_applications')
        ->cascadeOnDelete();

    $table->string('document_type');
    // cv, photo, certificate, other

    $table->string('file_path');

    $table->string('status')->default('submitted');

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_application_documents');
    }
};

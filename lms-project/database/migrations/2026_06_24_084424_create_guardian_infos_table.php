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
       Schema::create('guardian_infos', function (Blueprint $table) {
    $table->id();

    $table->foreignId('application_id')
        ->constrained('applications')
        ->cascadeOnDelete();

    $table->string('full_name');
    $table->string('relationship');
    $table->string('phone')->nullable();
    $table->string('document_type');
    $table->string('document_number')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guardian_infos');
    }
};

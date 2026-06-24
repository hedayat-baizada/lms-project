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
       Schema::create('email_logs', function (Blueprint $table) {
    $table->id();

    $table->foreignId('application_id')
        ->constrained('applications')
        ->cascadeOnDelete();

    $table->string('email');
    $table->string('subject');
    $table->longText('message')->nullable();
    $table->string('status')->default('pending');
    $table->timestamp('sent_at')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_logs');
    }
};

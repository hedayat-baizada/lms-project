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
       Schema::create('applications', function (Blueprint $table) {
    $table->id();

    $table->string('tracking_code')->unique()->nullable();

    $table->string('full_name')->nullable();
    $table->string('father_name')->nullable();
    $table->string('email')->unique();
    $table->string('phone')->nullable();
    $table->date('date_of_birth')->nullable();
    $table->string('gender')->nullable();
    $table->text('address')->nullable();

    $table->string('course_category')->nullable(); 
    $table->string('course_track')->nullable();
    $table->unsignedBigInteger('requested_level_id')->nullable();
    $table->unsignedBigInteger('assigned_level_id')->nullable();
    $table->string('selected_computer_topic')->nullable();

    $table->boolean('test_required')->default(false);
    $table->boolean('speaking_required')->default(false);

    $table->string('status')->default('incomplete');

    $table->timestamp('submitted_at')->nullable();
    $table->timestamp('reviewed_at')->nullable();
    $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
    $table->text('reviewer_notes')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};

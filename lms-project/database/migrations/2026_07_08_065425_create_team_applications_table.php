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
        Schema::create('team_applications', function (Blueprint $table) {
    $table->id();

    $table->string('tracking_code')->unique();

    $table->string('application_type');
    // volunteer_teacher, volunteer_manager, volunteer_support, professional_staff

    $table->string('teacher_subject')->nullable();
    // english, computer

    $table->string('status')->default('incomplete');
    // incomplete, waiting_review, need_correction, correction_submitted, approved, rejected

    $table->string('full_name');
    $table->string('father_name')->nullable();
    $table->string('email');
    $table->string('phone');
    $table->date('date_of_birth')->nullable();
    $table->string('gender')->nullable();
    $table->text('address')->nullable();

    $table->string('education_level')->nullable();
    $table->string('field_of_study')->nullable();
    $table->text('experience')->nullable();
    $table->text('skills')->nullable();
    $table->text('motivation')->nullable();

    $table->string('availability')->nullable();
    $table->string('preferred_mode')->nullable();
    // online, physical, both

    $table->text('reviewer_notes')->nullable();
    $table->timestamp('submitted_at')->nullable();
    $table->timestamp('reviewed_at')->nullable();
    $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_applications');
    }
};

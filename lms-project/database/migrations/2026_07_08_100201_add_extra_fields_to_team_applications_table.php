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
    Schema::table('team_applications', function (Blueprint $table) {

        $table->string('mobile_number')->nullable()->after('phone');

        $table->text('permanent_address')->nullable()->after('address');

        $table->string('university_school')->nullable()->after('education_level');

        $table->date('date_of_graduation')->nullable()->after('university_school');

        $table->string('language_qualification')->nullable()->after('field_of_study');

        $table->date('qualification_completion_date')->nullable()->after('language_qualification');

        $table->decimal('teaching_experience_years', 4, 1)
            ->nullable()
            ->after('qualification_completion_date');

        $table->string('computer_qualification')->nullable()->after('teaching_experience_years');

        $table->text('computer_skills')->nullable()->after('computer_qualification');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
{
    Schema::table('team_applications', function (Blueprint $table) {

        $table->dropColumn([
            'mobile_number',
            'permanent_address',
            'university_school',
            'date_of_graduation',
            'language_qualification',
            'qualification_completion_date',
            'teaching_experience_years',
            'computer_qualification',
            'computer_skills',
        ]);

    });
}
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('team_applications', function (Blueprint $table) {
            $table->string('professional_role')
                ->nullable()
                ->after('teacher_subject');
        });
    }

    public function down(): void
    {
        Schema::table('team_applications', function (Blueprint $table) {
            $table->dropColumn('professional_role');
        });
    }
};
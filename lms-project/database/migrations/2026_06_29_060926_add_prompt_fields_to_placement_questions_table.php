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
        Schema::table('placement_questions', function (Blueprint $table) {
    $table->string('section')->default('mcq')->after('test_code');
    $table->integer('duration_minutes')->nullable()->after('marks');
    $table->integer('word_limit')->nullable()->after('duration_minutes');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('placement_questions', function (Blueprint $table) {
    $table->dropColumn([
        'section',
        'duration_minutes',
        'word_limit',
    ]);
});
    }
};

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
        //
        Schema::table('placement_questions', function (Blueprint $table) {
    $table->string('test_code')->nullable()->after('id');
    $table->integer('question_number')->nullable()->after('test_code');

    $table->text('option_a')->nullable()->after('question_text');
    $table->text('option_b')->nullable()->after('option_a');
    $table->text('option_c')->nullable()->after('option_b');
    $table->text('option_d')->nullable()->after('option_c');

    $table->string('correct_answer')->nullable()->after('option_d');
});

Schema::table('placement_tests', function (Blueprint $table) {
    $table->string('test_code')->nullable()->after('test_type');

    $table->timestamp('started_at')->nullable()->after('status');
    $table->timestamp('expires_at')->nullable()->after('started_at');
    $table->timestamp('submitted_at')->nullable()->after('expires_at');

    $table->json('question_order')->nullable()->after('submitted_at');

    $table->integer('duration_minutes')->nullable()->after('question_order');

    $table->longText('writing_answer')->nullable()->after('total_score');
    $table->integer('writing_score')->nullable()->after('writing_answer');

    $table->text('speaking_prompt')->nullable()->after('writing_score');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('placement_questions', function (Blueprint $table) {
    $table->dropColumn([
        'test_code',
        'question_number',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_answer',
    ]);
});

Schema::table('placement_tests', function (Blueprint $table) {
    $table->dropColumn([
        'test_code',
        'started_at',
        'expires_at',
        'submitted_at',
        'question_order',
        'duration_minutes',
        'writing_answer',
        'writing_score',
        'speaking_prompt',
    ]);
});
    }
};

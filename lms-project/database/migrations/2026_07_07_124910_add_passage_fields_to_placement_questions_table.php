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

            $table->unsignedInteger('passage_number')
                ->nullable()
                ->after('question_number');

            $table->unsignedTinyInteger('blank_number')
                ->nullable()
                ->after('passage_number');

            $table->longText('passage_text')
                ->nullable()
                ->after('blank_number');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('placement_questions', function (Blueprint $table) {

            $table->dropColumn([
                'passage_number',
                'blank_number',
                'passage_text',
            ]);

        });
    }
};
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
        Schema::table('speaking_tests', function (Blueprint $table) {
    $table->string('status')->default('not_started')->after('audio_path');
    $table->timestamp('started_at')->nullable()->after('status');
    $table->timestamp('expires_at')->nullable()->after('started_at');
    $table->timestamp('submitted_at')->nullable()->after('expires_at');
    $table->boolean('attempt_used')->default(false)->after('submitted_at');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('speaking_tests', function (Blueprint $table) {
    $table->dropColumn([
        'status',
        'started_at',
        'expires_at',
        'submitted_at',
        'attempt_used',
    ]);
});
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_room_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->enum('type', ['video', 'online_meet']);
            $table->string('video_path')->nullable();
            $table->string('video_url')->nullable();
            $table->string('meet_link')->nullable();
            $table->text('description')->nullable();
            $table->integer('order');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
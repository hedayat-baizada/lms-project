<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentLessonProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lesson_id',
        'video_watched',
        'homework_submitted',
        'is_unlocked',
        'video_watched_at',
        'unlocked_at',
    ];

    protected function casts(): array
    {
        return [
            'video_watched'      => 'boolean',
            'homework_submitted' => 'boolean',
            'is_unlocked'        => 'boolean',
            'video_watched_at'   => 'datetime',
            'unlocked_at'        => 'datetime',
        ];
    }

    // شاگرد
    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // درس
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    // آیا درس کامل شده؟
    public function isCompleted(): bool
    {
        return $this->video_watched && $this->homework_submitted;
    }
}
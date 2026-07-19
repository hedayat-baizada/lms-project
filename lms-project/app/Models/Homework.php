<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Homework extends Model
{
    use HasFactory;

    protected $table = 'homeworks';

    protected $fillable = [
        'lesson_id',
        'title',
        'question',
    ];

    // درس این کارخانگی
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    // جواب‌های شاگردان
    public function submissions()
    {
        return $this->hasMany(HomeworkSubmission::class);
    }

    // جواب یک شاگرد خاص
    public function submissionForStudent(int $userId)
    {
        return $this->submissions()
                    ->where('user_id', $userId)
                    ->first();
    }
}
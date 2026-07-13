<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeworkSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'homework_id',
        'user_id',
        'answer',
        'teacher_feedback',
        'score',
        'status',
    ];

    // کارخانگی این جواب
    public function homework()
    {
        return $this->belongsTo(Homework::class);
    }

    // شاگردی که جواب داده
    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // آیا چک شده؟
    public function isReviewed(): bool
    {
        return $this->status === 'reviewed';
    }
}
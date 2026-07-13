<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinalExamSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'final_exam_id',
        'user_id',
        'final_exam_question_id',
        'answer',
        'score',
        'teacher_feedback',
        'status',
    ];

    // امتحان
    public function finalExam()
    {
        return $this->belongsTo(FinalExam::class);
    }

    // سوال
    public function question()
    {
        return $this->belongsTo(FinalExamQuestion::class, 'final_exam_question_id');
    }

    // شاگرد
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
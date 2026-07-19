<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinalExamQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'final_exam_id',
        'question',
        'order',
    ];

    // امتحان این سوال
    public function finalExam()
    {
        return $this->belongsTo(FinalExam::class);
    }

    // جواب‌های شاگردان برای این سوال
    public function submissions()
    {
        return $this->hasMany(FinalExamSubmission::class);
    }

    // جواب یک شاگرد خاص
    public function submissionForStudent(int $userId)
    {
        return $this->submissions()
                    ->where('user_id', $userId)
                    ->first();
    }
}
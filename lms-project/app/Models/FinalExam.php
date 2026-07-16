<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinalExam extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_room_id',
        'title',
        'description',
        'total_score',
    ];

    // کلاس این امتحان
    public function classRoom()
    {
        return $this->belongsTo(ClassRoom::class);
    }

    // سوالات امتحان
    public function questions()
    {
        return $this->hasMany(FinalExamQuestion::class)->orderBy('order');
    }

    // جواب‌های شاگردان
    public function submissions()
    {
        return $this->hasMany(FinalExamSubmission::class);
    }

    // جواب‌های یک شاگرد خاص
    public function submissionsForStudent(int $userId)
    {
        return $this->submissions()
                    ->where('user_id', $userId)
                    ->get();
    }
}
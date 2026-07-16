<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_room_id',
        'title',
        'type',
        'video_path',
        'video_url',
        'meet_link',
        'description',
        'order',
        'release_date',
    ];

    protected function casts(): array
    {
        return [
            'release_date' => 'date',
        ];
    }

    public function classRoom()
    {
        return $this->belongsTo(ClassRoom::class);
    }

    public function homework()
    {
        return $this->hasOne(Homework::class, 'lesson_id');
    }

    public function studentProgress()
    {
        return $this->hasMany(StudentLessonProgress::class);
    }

    public function progressForStudent(int $userId)
    {
        return $this->studentProgress()
                    ->where('user_id', $userId)
                    ->first();
    }

    public function isReleased(): bool
    {
        if (!$this->release_date) {
            return true;
        }
        return now()->startOfDay()->gte($this->release_date);
    }
}
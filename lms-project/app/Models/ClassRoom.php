<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'level',
        'has_video',
        'description',
        'is_active',
        'teacher_id',
        'start_date',
        'end_date',
    ];

    protected function casts(): array
    {
        return [
            'has_video' => 'boolean',
            'is_active' => 'boolean',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'class_room_user')
                    ->wherePivot('status', 'active')
                    ->withPivot('start_date', 'end_date', 'status')
                    ->withTimestamps();
    }

    public function finalExam()
    {
        return $this->hasOne(FinalExam::class);
    }

    public function isActiveNow(): bool
    {
        if (!$this->start_date || !$this->end_date) {
            return true;
        }
        $now = now()->startOfDay();
        return $now->between($this->start_date, $this->end_date);
    }

    public function hasStarted(): bool
    {
        if (!$this->start_date) return true;
        return now()->startOfDay()->gte($this->start_date);
    }

    public function hasEnded(): bool
    {
        if (!$this->end_date) return false;
        return now()->startOfDay()->gt($this->end_date);
    }
}
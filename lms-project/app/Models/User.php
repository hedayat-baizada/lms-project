<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens; 

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens; 

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'status',
        'role', 
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ==================== متدهای کمکی نقش ====================
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    // ====================Rel LMS ====================

    
    public function classRooms()
    {
        return $this->belongsToMany(ClassRoom::class, 'class_room_user')
                    ->withPivot('start_date', 'end_date', 'status')
                    ->withTimestamps();
    }
   

    public function taughtClasses()
    {
        return $this->hasMany(ClassRoom::class, 'teacher_id');
    }

    
    public function lessonProgress()
    {
        return $this->hasMany(StudentLessonProgress::class);
    }

    
    public function homeworkSubmissions()
    {
        return $this->hasMany(HomeworkSubmission::class);
    }

    public function finalExamSubmissions()
    {
        return $this->hasMany(FinalExamSubmission::class);
    }
}
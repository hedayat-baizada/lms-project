<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_code',

        'application_type',
        'teacher_subject',

        'status',

        'full_name',
        'father_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'address',

        'education_level',
        'field_of_study',
        'experience',
        'skills',
        'motivation',

        'availability',
        'preferred_mode',

        'reviewer_notes',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'date_of_birth' => 'date',
    ];

    public function documents()
    {
        return $this->hasMany(TeamApplicationDocument::class);
    }

    public function correctionRequests()
    {
        return $this->hasMany(TeamCorrectionRequest::class);
    }

    public function reviewActions()
    {
        return $this->hasMany(TeamReviewAction::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(TeamStatusLog::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
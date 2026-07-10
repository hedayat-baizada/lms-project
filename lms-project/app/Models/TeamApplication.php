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
        'professional_role',

        'availability',
        'preferred_mode',

        'reviewer_notes',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',

        'mobile_number',
        'permanent_address',
        'university_school',
        'date_of_graduation',
        'language_qualification',
        'qualification_completion_date',
        'teaching_experience_years',
        'computer_qualification',
        'computer_skills',
        'approved_at',
        'approved_by',
        'rejected_at',
        'rejected_by',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'date_of_birth' => 'date',
        'date_of_graduation' => 'date',
        'qualification_completion_date' => 'date',
        'teaching_experience_years' => 'decimal:1',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
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


    public function approvedByUser()
{
    return $this->belongsTo(User::class, 'approved_by');
}

public function rejectedByUser()
{
    return $this->belongsTo(User::class, 'rejected_by');
}
}
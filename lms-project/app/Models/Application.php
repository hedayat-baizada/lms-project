<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'tracking_code',
        'full_name',
        'father_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'address',
        'course_category',
        'course_track',
        'requested_level_id',
        'assigned_level_id',
        'selected_computer_topic',
        'test_required',
        'speaking_required',
        'status',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'reviewer_notes',
    ];

    public function documents()
    {
        return $this->hasMany(ApplicationDocument::class);
    }

    public function guardianInfo()
    {
        return $this->hasOne(GuardianInfo::class);
    }

    public function placementTest()
    {
        return $this->hasOne(PlacementTest::class);
    }

    public function speakingTest()
    {
        return $this->hasOne(SpeakingTest::class);
    }

    public function verificationCheck()
    {
        return $this->hasOne(VerificationCheck::class);
    }

    public function reviewActions()
    {
        return $this->hasMany(ReviewAction::class);
    }

    public function correctionRequests()
    {
        return $this->hasMany(CorrectionRequest::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(ApplicationStatusLog::class);
    }

    public function emailLogs()
    {
        return $this->hasMany(EmailLog::class);
    }
}
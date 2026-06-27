<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlacementTest extends Model
{
    
    protected $casts = [
    'question_order' => 'array',
    'started_at' => 'datetime',
    'expires_at' => 'datetime',
    'submitted_at' => 'datetime',
];

        protected $fillable = [
        'application_id',
        'test_type',
        'is_required',
        'status',
        'written_score',
        'speaking_score',
        'total_score',
        'reviewer_notes',
        'test_code',
        'started_at',
        'expires_at',
        'submitted_at',
        'question_order',
        'duration_minutes',
        'writing_answer',
        'writing_score',
        'speaking_prompt',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function answers()
    {
        return $this->hasMany(PlacementAnswer::class);
    }
}
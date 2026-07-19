<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpeakingTest extends Model
{
    protected $fillable = [
        'application_id',
        'audio_path',
        'score',
        'reviewer_notes',
        'status',
        'started_at',
        'expires_at',
        'submitted_at',
        'attempt_used',
    ];

    protected $casts = [
    'started_at' => 'datetime',
    'expires_at' => 'datetime',
    'submitted_at' => 'datetime',
    'attempt_used' => 'boolean',
];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
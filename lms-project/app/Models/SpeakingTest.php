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
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlacementTest extends Model
{
    protected $fillable = [
        'application_id',
        'test_type',
        'is_required',
        'status',
        'written_score',
        'speaking_score',
        'total_score',
        'reviewer_notes',
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
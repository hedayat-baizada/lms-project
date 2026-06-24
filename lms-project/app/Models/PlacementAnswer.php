<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlacementAnswer extends Model
{
    protected $fillable = [
        'placement_test_id',
        'question_id',
        'answer_text',
        'score',
        'reviewer_notes',
    ];

    public function placementTest()
    {
        return $this->belongsTo(PlacementTest::class);
    }

    public function question()
    {
        return $this->belongsTo(PlacementQuestion::class, 'question_id');
    }
}
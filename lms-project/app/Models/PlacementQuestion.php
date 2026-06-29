<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlacementQuestion extends Model
{
    protected $fillable = [
        'course_track',
        'level_id',
        'question_text',
        'question_type',
        'marks',
        'status',
        'test_code',
        'question_number',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_answer',
        'section',
        'duration_minutes',
        'word_limit',
    ];

    public function answers()
    {
        return $this->hasMany(PlacementAnswer::class, 'question_id');
    }
}
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
    ];

    public function answers()
    {
        return $this->hasMany(PlacementAnswer::class, 'question_id');
    }
}
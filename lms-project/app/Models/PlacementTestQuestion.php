<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlacementTestQuestion extends Model
{
    protected $fillable = [
        'placement_test_id',
        'placement_question_id',
        'display_order',
    ];

    public function placementTest()
    {
        return $this->belongsTo(PlacementTest::class);
    }

    public function placementQuestion()
    {
        return $this->belongsTo(PlacementQuestion::class);
    }
}
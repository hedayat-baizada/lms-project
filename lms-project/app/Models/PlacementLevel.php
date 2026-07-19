<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlacementLevel extends Model
{
    protected $fillable = [
        'program',
        'level_code',
        'display_name',
        'display_order',
        'active',
    ];
}
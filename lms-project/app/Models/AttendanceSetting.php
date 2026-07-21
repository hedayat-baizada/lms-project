<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceSetting extends Model
{
    protected $fillable = [
        'class_room_id',
        'period_days',
        'official_off_day',
        'teacher_off_day',
        'full_marks',
    'teacher_warning_after',
    'admin_warning_after',
];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamStatusLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_application_id',
        'old_status',
        'new_status',
        'changed_by',
        'notes',
    ];

    public function application()
    {
        return $this->belongsTo(TeamApplication::class);
    }

    public function changer()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
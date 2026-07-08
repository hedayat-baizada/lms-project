<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamCorrectionRequest extends Model
{
    //

    protected $fillable = [
    'team_application_id',
    'reviewer_id',
    'message',
    'status',
];
    
    public function application()
{
    return $this->belongsTo(TeamApplication::class);
}

public function reviewer()
{
    return $this->belongsTo(User::class, 'reviewer_id');
}


}

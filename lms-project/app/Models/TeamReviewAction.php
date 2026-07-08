<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamReviewAction extends Model
{
    //

    public function application()
{
    return $this->belongsTo(TeamApplication::class);
}

public function reviewer()
{
    return $this->belongsTo(User::class, 'reviewer_id');
}
}

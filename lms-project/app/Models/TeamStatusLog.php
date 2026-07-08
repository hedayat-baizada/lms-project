<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamStatusLog extends Model
{
    //

    public function application()
{
    return $this->belongsTo(TeamApplication::class);
}

public function changer()
{
    return $this->belongsTo(User::class, 'changed_by');
}
}

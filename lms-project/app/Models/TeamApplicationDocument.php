<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamApplicationDocument extends Model
{
    //
    public function application()
{
    return $this->belongsTo(TeamApplication::class);
}
}

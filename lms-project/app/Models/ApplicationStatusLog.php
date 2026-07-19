<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationStatusLog extends Model
{
    protected $fillable = [
        'application_id',
        'old_status',
        'new_status',
        'changed_by',
        'notes',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
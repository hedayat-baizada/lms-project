<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CorrectionRequest extends Model
{
    protected $fillable = [
        'application_id',
        'requested_by',
        'message',
        'status',
        'resolved_at',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
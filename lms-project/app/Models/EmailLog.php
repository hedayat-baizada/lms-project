<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    protected $fillable = [
        'application_id',
        'email',
        'subject',
        'message',
        'status',
        'sent_at',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
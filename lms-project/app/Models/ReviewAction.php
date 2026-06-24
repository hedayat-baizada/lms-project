<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewAction extends Model
{
    protected $fillable = [
        'application_id',
        'reviewer_id',
        'action',
        'notes',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
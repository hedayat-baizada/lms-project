<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationCheck extends Model
{
    protected $fillable = [
        'application_id',
        'checked_by',
        'document_status',
        'personal_info_status',
        'test_status',
        'speaking_status',
        'overall_status',
        'notes',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
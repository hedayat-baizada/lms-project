<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuardianInfo extends Model
{
    protected $fillable = [
        'application_id',
        'full_name',
        'relationship',
        'phone',
        'document_type',
        'document_number',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
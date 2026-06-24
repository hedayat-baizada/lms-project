<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationDocument extends Model
{
    protected $fillable = [
        'application_id',
        'document_owner_type',
        'document_type',
        'document_name',
        'document_number',
        'file_path',
        'status',
        'reviewer_notes',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamApplicationDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_application_id',
        'document_type',
        'file_path',
        'status',
    ];

    public function application()
    {
        return $this->belongsTo(TeamApplication::class);
    }
}
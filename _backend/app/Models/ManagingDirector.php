<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManagingDirector extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'partner_id',
        'first_name',
        'last_name',
    ];

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogActivity extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'action',
        'contract_id'    
    ];

   

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}

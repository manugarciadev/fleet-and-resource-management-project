<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Brick\Money\Money;

class Renovation extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'renewal_date',
        'description',
        'contract_id',
        'value' 
    ];


    protected $casts = [
        'renewal_date' => 'date',
    ];

    public function getValueAttribute($value)
    {
        return Money::of($value, 'EUR');
    }

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}

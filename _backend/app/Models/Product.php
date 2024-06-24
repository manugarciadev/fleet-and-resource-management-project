<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Brick\Money\Money;

class Product extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'name',
        'code', 
        'description',
        'value',
        'human_id',
        'material_id'
    ];

    public function getValueAttribute($value)
    {
        return Money::of($value, 'EUR');
    }

    public function humanResources()
    {
        return $this->belongsTo(HumanResource::class);
    }

    public function materialResources()
    {
        return $this->belongsTo(MaterialResource::class);
    }

    public function bookingForPayouts()
    {
        return $this->hasMany(BookingForPayout::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingForPayout extends Model
{
    use HasFactory;

    protected $fillable = [
        'bookingReference',
        'leadTraveler',
        'productCode',
        'optionCode',
        'activityDate',
        'bookingDate',
        'retailRate',
        'netRate',
        'product_id'
    ];

    protected $dates = [
        'activityDate',
        'bookingDate',
    ];

    

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
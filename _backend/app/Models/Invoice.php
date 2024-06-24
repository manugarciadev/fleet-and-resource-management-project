<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Brick\Money\Money;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'bookingForPayouts_id', 
        'invoice_number', 
        'issue_date', 
        'due_date', 
        'period', 
        'value'
    ];

    protected $dates = [
        'issue_date',
        'due_date',
    ];

   // public function getValueAttribute($value)
    //{
    //    return Money::of($value, 'EUR');
   // }

    public function bookingForPayout()
    {
        return $this->belongsTo(BookingForPayout::class);
    }

    public function paymentAndTaxDetail()
    {
        return $this->hasOne(PaymentAndTaxDetail::class);
    }
}

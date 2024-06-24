<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentAndTaxDetail extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'invoice_id',
        'vat_number',
        'contry_of_issue',
        'tax_number',
        'tin_country_of_issue',
        'payment_data_status',
        'payment_method',
        'payment_frequency',
        'commission_rate',
        'currency'
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}

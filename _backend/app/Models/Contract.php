<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'code',
        'description',
        'start_date',
        'end_date',
        'type_id',
        'signature_id',
        'partner_id',
        'employee_id'   
    ];

     // Acessor para a data de assinatura
   public function getSignatureDateAttribute($value)
   {
       return $value ? Carbon::parse($value)->format('Y-m-d') : null;
   }

   // Acessor para a data de validade
   public function getValidityAttribute($value)
   {
       return $value ? Carbon::parse($value)->format('Y-m-d') : null;
   }


    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function contractType()
    {
        return $this->belongsTo(ContractType::class);
    }

    public function renovations()
    {
        return $this->hasMany(Renovation::class);
    }

    public function logActivitys()
    {
        return $this->hasMany(LogActivity::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

}

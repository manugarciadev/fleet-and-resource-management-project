<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = ['signatureDate', 'validity', 'proof'];

   
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


    public function rules(){
        return [
            'proof' => 'file|mimes:png,jpeg,pfd'
        ];
    }

    public function contract()
    {
        return $this->hasOne(Contract::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'partner_id',
        'employee_id',
        'title',
        'date',
        'document',
        'validity'
    ];

    protected $casts = [
        'date' => 'date',
        'validity'   => 'date',
    ];

    public function rules(){
        return [
            'document' => 'file|mimes:png,jpeg,pfd'
        ];
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}

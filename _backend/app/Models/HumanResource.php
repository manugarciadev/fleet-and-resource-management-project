<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HumanResource extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'description',
        'employee_id',
        'resource_id'  
    ];

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
    
}

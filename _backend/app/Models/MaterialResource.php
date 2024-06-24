<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialResource extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'description',
        'status',
        'resource_id'   
    ];

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}

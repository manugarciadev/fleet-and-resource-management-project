<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'name', 
        'type_id', 
        'user_id',
        'partner_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function humanResources()
    {
        return $this->hasMany(HumanResource::class);
    }

    public function materialResources()
    {
        return $this->hasMany(MaterialResource::class);
    }


}

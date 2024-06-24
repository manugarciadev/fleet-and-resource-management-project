<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'function',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contract()
    {
        return $this->hasOne(Contract::class);
    }

    public function humanResource()
    {
        return $this->hasOne(HumanResource::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

}

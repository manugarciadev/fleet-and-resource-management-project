<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    use HasFactory;

    protected $fillable = [
        'legal_name', 'logo', 'public_name', 'status', 'description',
        'website_and_social_media', 'street_address', 'city', 'postal_code',
        'state_region', 'country_code', 'mobile_phone', 'emergency_phone_number',
        'email', 'company_registration_number',
    ];

    protected $casts = [
        'website_and_social_media' => 'json',
    ];

    public function contract()
    {
        return $this->hasOne(Contract::class);
    }

    public function resources()
    {
        return $this->hasMany(Resource::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function managingDirectors()
    {
        return $this->hasMany(ManagingDirector::class);
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionCompanyDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_id',
        'brand_name',
        'company_field_id',
        'package_range_id',
        'cr_number',
        'extra_information',
    ];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function companyField()
    {
        return $this->belongsTo(CompanyField::class);
    }

    public function packageRange()
    {
        return $this->belongsTo(PackageRange::class);
    }
}

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
        'company_package_id',
        'cr_number',
        'extra_information',
    ];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function companyPackage()
    {
        return $this->belongsTo(CompanyPackage::class);
    }
}

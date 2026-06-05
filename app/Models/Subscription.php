<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id',
        'type',
        'status',
        'email',
        'full_name',
        'country_id',
        'accept_conditions',
        'scheduled_at',
        'status_reason',
    ];

    protected function casts(): array
    {
        return [
            'accept_conditions' => 'boolean',
            'scheduled_at' => 'datetime',
        ];
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function traineeDetail()
    {
        return $this->hasOne(SubscriptionTraineeDetail::class);
    }

    public function trainerDetail()
    {
        return $this->hasOne(SubscriptionTrainerDetail::class);
    }

    public function companyDetail()
    {
        return $this->hasOne(SubscriptionCompanyDetail::class);
    }

    public function timeSlots()
    {
        return $this->hasMany(SubscriptionTimeSlot::class);
    }

    public function files()
    {
        return $this->hasMany(SubscriptionFile::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(SubscriptionStatusLog::class);
    }
}

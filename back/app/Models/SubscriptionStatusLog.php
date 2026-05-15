<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionStatusLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_id',
        'from_status',
        'to_status',
        'reason',
        'changed_by',
    ];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}

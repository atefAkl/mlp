<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionTrainerDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_id',
        'position_id',
    ];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionTraineeDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_id',
        'stack_id',
        'round_id',
    ];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function stack()
    {
        return $this->belongsTo(Stack::class);
    }

    public function round()
    {
        return $this->belongsTo(Round::class);
    }
}

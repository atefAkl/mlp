<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionTrainerDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_id',
        'trainer_opportunity_id',
    ];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function positions()
    {
        return $this->morphToMany(Position::class, 'positionable');
    }

    public function skills()
    {
        return $this->morphToMany(Skill::class, 'skillable');
    }

    public function trainerOpportunity()
    {
        return $this->belongsTo(TrainerOpportunity::class);
    }
}

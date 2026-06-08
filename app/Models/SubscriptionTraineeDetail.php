<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionTraineeDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_id',
        'training_program_id',
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

    public function trainingProgram()
    {
        return $this->belongsTo(TrainingProgram::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function trainingPrograms()
    {
        return $this->morphedByMany(TrainingProgram::class, 'positionable');
    }

    public function trainerOpportunities()
    {
        return $this->morphedByMany(TrainerOpportunity::class, 'positionable');
    }

    public function subscriptionTraineeDetails()
    {
        return $this->morphedByMany(SubscriptionTraineeDetail::class, 'positionable');
    }

    public function subscriptionTrainerDetails()
    {
        return $this->morphedByMany(SubscriptionTrainerDetail::class, 'positionable');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function trainingPrograms()
    {
        return $this->morphedByMany(TrainingProgram::class, 'skillable');
    }

    public function trainerOpportunities()
    {
        return $this->morphedByMany(TrainerOpportunity::class, 'skillable');
    }

    public function subscriptionTraineeDetails()
    {
        return $this->morphedByMany(SubscriptionTraineeDetail::class, 'skillable');
    }

    public function subscriptionTrainerDetails()
    {
        return $this->morphedByMany(SubscriptionTrainerDetail::class, 'skillable');
    }
}

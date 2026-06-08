<?php

namespace App\Policies;

use App\Models\TrainingProgram;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TrainingProgramPolicy
{
    use HandlesAuthorization;

    public function viewAny(?User $user): bool
    {
        return true; // Anyone can view published ones, filtering is in repository
    }

    public function view(?User $user, TrainingProgram $trainingProgram): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage_training_programs');
    }

    public function update(User $user, TrainingProgram $trainingProgram): bool
    {
        return $user->hasPermissionTo('manage_training_programs');
    }

    public function delete(User $user, TrainingProgram $trainingProgram): bool
    {
        return $user->hasPermissionTo('manage_training_programs');
    }

    public function activate(User $user, TrainingProgram $trainingProgram): bool
    {
        return $user->hasPermissionTo('manage_training_programs');
    }

    public function deactivate(User $user, TrainingProgram $trainingProgram): bool
    {
        return $user->hasPermissionTo('manage_training_programs');
    }
}

<?php

namespace App\Policies;

use App\Models\TrainerOpportunity;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TrainerOpportunityPolicy
{
    use HandlesAuthorization;

    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, TrainerOpportunity $trainerOpportunity): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage_trainer_opportunities');
    }

    public function update(User $user, TrainerOpportunity $trainerOpportunity): bool
    {
        return $user->hasPermissionTo('manage_trainer_opportunities');
    }

    public function delete(User $user, TrainerOpportunity $trainerOpportunity): bool
    {
        return $user->hasPermissionTo('manage_trainer_opportunities');
    }

    public function activate(User $user, TrainerOpportunity $trainerOpportunity): bool
    {
        return $user->hasPermissionTo('manage_trainer_opportunities');
    }

    public function deactivate(User $user, TrainerOpportunity $trainerOpportunity): bool
    {
        return $user->hasPermissionTo('manage_trainer_opportunities');
    }
}

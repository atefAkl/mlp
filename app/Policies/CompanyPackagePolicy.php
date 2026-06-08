<?php

namespace App\Policies;

use App\Models\CompanyPackage;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CompanyPackagePolicy
{
    use HandlesAuthorization;

    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, CompanyPackage $companyPackage): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage_company_packages');
    }

    public function update(User $user, CompanyPackage $companyPackage): bool
    {
        return $user->hasPermissionTo('manage_company_packages');
    }

    public function delete(User $user, CompanyPackage $companyPackage): bool
    {
        return $user->hasPermissionTo('manage_company_packages');
    }

    public function activate(User $user, CompanyPackage $companyPackage): bool
    {
        return $user->hasPermissionTo('manage_company_packages');
    }

    public function deactivate(User $user, CompanyPackage $companyPackage): bool
    {
        return $user->hasPermissionTo('manage_company_packages');
    }
}

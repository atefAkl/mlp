<?php

namespace App\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;

interface TrainerOpportunityRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get paginated trainer opportunities with spatie query builder.
     */
    public function getList(int $perPage = 15): LengthAwarePaginator;
    
    /**
     * Change status of an opportunity.
     */
    public function changeStatus(int $id, string $status): bool;
}

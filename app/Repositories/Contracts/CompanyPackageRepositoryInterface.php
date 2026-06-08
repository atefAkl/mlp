<?php

namespace App\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;

interface CompanyPackageRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get paginated company packages with spatie query builder.
     */
    public function getList(int $perPage = 15): LengthAwarePaginator;
    
    /**
     * Change status of a package.
     */
    public function changeStatus(int $id, string $status): bool;
}

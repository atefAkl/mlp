<?php

namespace App\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;

interface TrainingProgramRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get paginated training programs with spatie query builder.
     */
    public function getList(int $perPage = 15): LengthAwarePaginator;
    
    /**
     * Change status of a program.
     */
    public function changeStatus(int $id, string $status): bool;
}

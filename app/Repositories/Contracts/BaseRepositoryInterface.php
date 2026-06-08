<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface BaseRepositoryInterface
{
    public function all(): Collection;
    
    public function paginate(int $perPage = 15): LengthAwarePaginator;
    
    public function find(int $id): ?Model;
    
    public function findOrFail(int $id): Model;
    
    public function create(array $data): Model;
    
    public function update(int $id, array $data): Model;
    
    public function delete(int $id): bool;
}

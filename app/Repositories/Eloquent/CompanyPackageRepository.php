<?php

namespace App\Repositories\Eloquent;

use App\Models\CompanyPackage;
use App\Repositories\Contracts\CompanyPackageRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class CompanyPackageRepository extends BaseRepository implements CompanyPackageRepositoryInterface
{
    public function __construct(CompanyPackage $model)
    {
        parent::__construct($model);
    }

    public function getList(int $perPage = 15): LengthAwarePaginator
    {
        return QueryBuilder::for(CompanyPackage::class)
            ->allowedFilters([
                'status',
                'support_level',
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('name', 'like', "%{$value}%")
                          ->orWhere('description', 'like', "%{$value}%");
                    });
                }),
            ])
            ->allowedSorts([
                'created_at',
                'price'
            ])
            ->defaultSort('-created_at')
            ->paginate($perPage);
    }

    public function changeStatus(int $id, string $status): bool
    {
        $package = $this->findOrFail($id);
        return $package->update(['status' => $status]);
    }
}

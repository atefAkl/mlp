<?php

namespace App\Repositories\Eloquent;

use App\Models\TrainerOpportunity;
use App\Repositories\Contracts\TrainerOpportunityRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class TrainerOpportunityRepository extends BaseRepository implements TrainerOpportunityRepositoryInterface
{
    public function __construct(TrainerOpportunity $model)
    {
        parent::__construct($model);
    }

    public function getList(int $perPage = 15): LengthAwarePaginator
    {
        return QueryBuilder::for(TrainerOpportunity::class)
            ->allowedFilters([
                'specialization',
                'employment_type',
                'experience_level',
                'status',
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('title', 'like', "%{$value}%")
                          ->orWhere('description', 'like', "%{$value}%");
                    });
                }),
            ])
            ->allowedSorts([
                'created_at',
                'application_deadline'
            ])
            ->defaultSort('-created_at')
            ->paginate($perPage);
    }

    public function changeStatus(int $id, string $status): bool
    {
        $opportunity = $this->findOrFail($id);
        return $opportunity->update(['status' => $status]);
    }
}

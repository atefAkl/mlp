<?php

namespace App\Repositories\Eloquent;

use App\Models\TrainingProgram;
use App\Repositories\Contracts\TrainingProgramRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class TrainingProgramRepository extends BaseRepository implements TrainingProgramRepositoryInterface
{
    public function __construct(TrainingProgram $model)
    {
        parent::__construct($model);
    }

    public function getList(int $perPage = 15): LengthAwarePaginator
    {
        return QueryBuilder::for(TrainingProgram::class)
            ->allowedIncludes(['skills', 'positions'])
            ->allowedFilters([
                'status',
                'training_type',
                'project_type',
                'level',
                'start_date',
                AllowedFilter::callback('price_from', function ($query, $value) {
                    $query->where('price', '>=', $value);
                }),
                AllowedFilter::callback('price_to', function ($query, $value) {
                    $query->where('price', '<=', $value);
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('title', 'like', "%{$value}%")
                          ->orWhere('description', 'like', "%{$value}%");
                    });
                }),
            ])
            ->allowedSorts([
                'created_at',
                'start_date',
                'price'
            ])
            ->defaultSort('-created_at')
            ->paginate($perPage);
    }

    public function changeStatus(int $id, string $status): bool
    {
        $program = $this->findOrFail($id);
        return $program->update(['status' => $status]);
    }
}

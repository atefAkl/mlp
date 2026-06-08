<?php

namespace App\Services;

use App\Repositories\Contracts\TrainingProgramRepositoryInterface;
use Illuminate\Support\Str;

class TrainingProgramService
{
    protected TrainingProgramRepositoryInterface $repository;

    public function __construct(TrainingProgramRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllPrograms(int $perPage = 15)
    {
        return $this->repository->getList($perPage);
    }

    public function getProgram(int $id)
    {
        return $this->repository->findOrFail($id)->load(['skills', 'positions']);
    }

    public function createProgram(array $data)
    {
        $data['slug'] = Str::slug($data['title']) . '-' . uniqid();
        
        $skillIds = $data['skill_ids'] ?? [];
        $positionIds = $data['position_ids'] ?? [];
        unset($data['skill_ids'], $data['position_ids']);

        $program = $this->repository->create($data);
        
        if (!empty($skillIds)) {
            $program->skills()->sync($skillIds);
        }
        if (!empty($positionIds)) {
            $program->positions()->sync($positionIds);
        }
        
        return $program;
    }

    public function updateProgram(int $id, array $data)
    {
        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . uniqid();
        }

        $skillIds = $data['skill_ids'] ?? null;
        $positionIds = $data['position_ids'] ?? null;
        unset($data['skill_ids'], $data['position_ids']);

        $program = $this->repository->update($id, $data);

        if ($skillIds !== null) {
            $program->skills()->sync($skillIds);
        }
        if ($positionIds !== null) {
            $program->positions()->sync($positionIds);
        }

        return $program;
    }

    public function deleteProgram(int $id)
    {
        return $this->repository->delete($id);
    }

    public function activateProgram(int $id)
    {
        return $this->repository->changeStatus($id, 'published');
    }

    public function deactivateProgram(int $id)
    {
        return $this->repository->changeStatus($id, 'draft');
    }
}

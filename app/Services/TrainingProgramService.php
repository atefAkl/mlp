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
        return $this->repository->findOrFail($id);
    }

    public function createProgram(array $data)
    {
        $data['slug'] = Str::slug($data['title']) . '-' . uniqid();
        return $this->repository->create($data);
    }

    public function updateProgram(int $id, array $data)
    {
        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . uniqid();
        }
        return $this->repository->update($id, $data);
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

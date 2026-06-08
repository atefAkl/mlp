<?php

namespace App\Services;

use App\Repositories\Contracts\TrainerOpportunityRepositoryInterface;

class TrainerOpportunityService
{
    protected TrainerOpportunityRepositoryInterface $repository;

    public function __construct(TrainerOpportunityRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllOpportunities(int $perPage = 15)
    {
        return $this->repository->getList($perPage);
    }

    public function getOpportunity(int $id)
    {
        return $this->repository->findOrFail($id)->load(['skills', 'positions']);
    }

    public function createOpportunity(array $data)
    {
        $skillIds = $data['skill_ids'] ?? [];
        $positionIds = $data['position_ids'] ?? [];
        unset($data['skill_ids'], $data['position_ids']);

        $opportunity = $this->repository->create($data);

        if (!empty($skillIds)) {
            $opportunity->skills()->sync($skillIds);
        }
        if (!empty($positionIds)) {
            $opportunity->positions()->sync($positionIds);
        }

        return $opportunity;
    }

    public function updateOpportunity(int $id, array $data)
    {
        $skillIds = $data['skill_ids'] ?? null;
        $positionIds = $data['position_ids'] ?? null;
        unset($data['skill_ids'], $data['position_ids']);

        $opportunity = $this->repository->update($id, $data);

        if ($skillIds !== null) {
            $opportunity->skills()->sync($skillIds);
        }
        if ($positionIds !== null) {
            $opportunity->positions()->sync($positionIds);
        }

        return $opportunity;
    }

    public function deleteOpportunity(int $id)
    {
        return $this->repository->delete($id);
    }

    public function activateOpportunity(int $id)
    {
        return $this->repository->changeStatus($id, 'open');
    }

    public function deactivateOpportunity(int $id)
    {
        return $this->repository->changeStatus($id, 'closed');
    }
}

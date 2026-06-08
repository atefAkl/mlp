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
        return $this->repository->findOrFail($id);
    }

    public function createOpportunity(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateOpportunity(int $id, array $data)
    {
        return $this->repository->update($id, $data);
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

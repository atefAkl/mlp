<?php

namespace App\Services;

use App\Repositories\Contracts\CompanyPackageRepositoryInterface;
use Illuminate\Support\Str;

class CompanyPackageService
{
    protected CompanyPackageRepositoryInterface $repository;

    public function __construct(CompanyPackageRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllPackages(int $perPage = 15)
    {
        return $this->repository->getList($perPage);
    }

    public function getPackage(int $id)
    {
        return $this->repository->findOrFail($id);
    }

    public function createPackage(array $data)
    {
        $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        return $this->repository->create($data);
    }

    public function updatePackage(int $id, array $data)
    {
        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        }
        return $this->repository->update($id, $data);
    }

    public function deletePackage(int $id)
    {
        return $this->repository->delete($id);
    }

    public function activatePackage(int $id)
    {
        return $this->repository->changeStatus($id, 'active');
    }

    public function deactivatePackage(int $id)
    {
        return $this->repository->changeStatus($id, 'inactive');
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompanyPackageRequest;
use App\Http\Requests\UpdateCompanyPackageRequest;
use App\Http\Resources\CompanyPackageResource;
use App\Models\CompanyPackage;
use App\Services\CompanyPackageService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use OpenApi\Annotations as OA;

class CompanyPackageController extends Controller
{
    use ApiResponse;

    protected CompanyPackageService $service;

    public function __construct(CompanyPackageService $service)
    {
        $this->service = $service;
    }

    /**
     * @OA\Get(
     *      path="/api/company-packages",
     *      operationId="getCompanyPackagesList",
     *      tags={"Company Packages"},
     *      summary="Get list of company packages",
     *      description="Returns list of company packages",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *       )
     * )
     */
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', CompanyPackage::class);
        $packages = $this->service->getAllPackages();
        
        return $this->successResponse(
            CompanyPackageResource::collection($packages)->response()->getData(true),
            'Packages retrieved successfully'
        );
    }

    /**
     * @OA\Post(
     *      path="/api/company-packages",
     *      operationId="storeCompanyPackage",
     *      tags={"Company Packages"},
     *      summary="Store new company package",
     *      description="Returns company package data",
     *      security={{"sanctum":{}}},
     *      @OA\RequestBody(
     *          required=true
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation"
     *       )
     * )
     */
    public function store(StoreCompanyPackageRequest $request): JsonResponse
    {
        $this->authorize('create', CompanyPackage::class);
        $package = $this->service->createPackage($request->validated());
        
        return $this->successResponse(
            new CompanyPackageResource($package),
            'Package created successfully',
            201
        );
    }

    /**
     * @OA\Get(
     *      path="/api/company-packages/{id}",
     *      operationId="getCompanyPackageById",
     *      tags={"Company Packages"},
     *      summary="Get company package information",
     *      description="Returns company package data",
     *      @OA\Parameter(
     *          name="id",
     *          description="Package id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *       )
     * )
     */
    public function show(int $id): JsonResponse
    {
        $package = $this->service->getPackage($id);
        $this->authorize('view', $package);
        
        return $this->successResponse(
            new CompanyPackageResource($package),
            'Package retrieved successfully'
        );
    }

    /**
     * @OA\Put(
     *      path="/api/company-packages/{id}",
     *      operationId="updateCompanyPackage",
     *      tags={"Company Packages"},
     *      summary="Update existing company package",
     *      description="Returns updated company package data",
     *      security={{"sanctum":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          description="Package id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\RequestBody(
     *          required=true
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *       )
     * )
     */
    public function update(UpdateCompanyPackageRequest $request, int $id): JsonResponse
    {
        $package = $this->service->getPackage($id);
        $this->authorize('update', $package);
        
        $package = $this->service->updatePackage($id, $request->validated());
        
        return $this->successResponse(
            new CompanyPackageResource($package),
            'Package updated successfully'
        );
    }

    /**
     * @OA\Delete(
     *      path="/api/company-packages/{id}",
     *      operationId="deleteCompanyPackage",
     *      tags={"Company Packages"},
     *      summary="Delete existing company package",
     *      description="Deletes a record and returns no content",
     *      security={{"sanctum":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          description="Package id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *       )
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $package = $this->service->getPackage($id);
        $this->authorize('delete', $package);
        
        $this->service->deletePackage($id);
        
        return $this->successResponse([], 'Package deleted successfully');
    }

    /**
     * @OA\Patch(
     *      path="/api/company-packages/{id}/activate",
     *      operationId="activateCompanyPackage",
     *      tags={"Company Packages"},
     *      summary="Activate existing company package",
     *      description="Activates a company package",
     *      security={{"sanctum":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          description="Package id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *       )
     * )
     */
    public function activate(int $id): JsonResponse
    {
        $package = $this->service->getPackage($id);
        $this->authorize('activate', $package);
        
        $this->service->activatePackage($id);
        
        return $this->successResponse([], 'Package activated successfully');
    }

    /**
     * @OA\Patch(
     *      path="/api/company-packages/{id}/deactivate",
     *      operationId="deactivateCompanyPackage",
     *      tags={"Company Packages"},
     *      summary="Deactivate existing company package",
     *      description="Deactivates a company package",
     *      security={{"sanctum":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          description="Package id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *       )
     * )
     */
    public function deactivate(int $id): JsonResponse
    {
        $package = $this->service->getPackage($id);
        $this->authorize('deactivate', $package);
        
        $this->service->deactivatePackage($id);
        
        return $this->successResponse([], 'Package deactivated successfully');
    }
}

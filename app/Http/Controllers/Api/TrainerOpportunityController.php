<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTrainerOpportunityRequest;
use App\Http\Requests\UpdateTrainerOpportunityRequest;
use App\Http\Resources\TrainerOpportunityResource;
use App\Models\TrainerOpportunity;
use App\Services\TrainerOpportunityService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use OpenApi\Annotations as OA;

class TrainerOpportunityController extends Controller
{
    use ApiResponse;

    protected TrainerOpportunityService $service;

    public function __construct(TrainerOpportunityService $service)
    {
        $this->service = $service;
    }

    /**
     * @OA\Get(
     *      path="/api/trainer-opportunities",
     *      operationId="getTrainerOpportunitiesList",
     *      tags={"Trainer Opportunities"},
     *      summary="Get list of trainer opportunities",
     *      description="Returns list of trainer opportunities",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *       )
     * )
     */
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', TrainerOpportunity::class);
        $opportunities = $this->service->getAllOpportunities();
        
        return $this->successResponse(
            TrainerOpportunityResource::collection($opportunities)->response()->getData(true),
            'Opportunities retrieved successfully'
        );
    }

    /**
     * @OA\Post(
     *      path="/api/trainer-opportunities",
     *      operationId="storeTrainerOpportunity",
     *      tags={"Trainer Opportunities"},
     *      summary="Store new trainer opportunity",
     *      description="Returns trainer opportunity data",
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
    public function store(StoreTrainerOpportunityRequest $request): JsonResponse
    {
        $this->authorize('create', TrainerOpportunity::class);
        $opportunity = $this->service->createOpportunity($request->validated());
        
        return $this->successResponse(
            new TrainerOpportunityResource($opportunity),
            'Opportunity created successfully',
            201
        );
    }

    /**
     * @OA\Get(
     *      path="/api/trainer-opportunities/{id}",
     *      operationId="getTrainerOpportunityById",
     *      tags={"Trainer Opportunities"},
     *      summary="Get trainer opportunity information",
     *      description="Returns trainer opportunity data",
     *      @OA\Parameter(
     *          name="id",
     *          description="Opportunity id",
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
        $opportunity = $this->service->getOpportunity($id);
        $this->authorize('view', $opportunity);
        
        return $this->successResponse(
            new TrainerOpportunityResource($opportunity),
            'Opportunity retrieved successfully'
        );
    }

    /**
     * @OA\Put(
     *      path="/api/trainer-opportunities/{id}",
     *      operationId="updateTrainerOpportunity",
     *      tags={"Trainer Opportunities"},
     *      summary="Update existing trainer opportunity",
     *      description="Returns updated trainer opportunity data",
     *      security={{"sanctum":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          description="Opportunity id",
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
    public function update(UpdateTrainerOpportunityRequest $request, int $id): JsonResponse
    {
        $opportunity = $this->service->getOpportunity($id);
        $this->authorize('update', $opportunity);
        
        $opportunity = $this->service->updateOpportunity($id, $request->validated());
        
        return $this->successResponse(
            new TrainerOpportunityResource($opportunity),
            'Opportunity updated successfully'
        );
    }

    /**
     * @OA\Delete(
     *      path="/api/trainer-opportunities/{id}",
     *      operationId="deleteTrainerOpportunity",
     *      tags={"Trainer Opportunities"},
     *      summary="Delete existing trainer opportunity",
     *      description="Deletes a record and returns no content",
     *      security={{"sanctum":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          description="Opportunity id",
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
        $opportunity = $this->service->getOpportunity($id);
        $this->authorize('delete', $opportunity);
        
        $this->service->deleteOpportunity($id);
        
        return $this->successResponse([], 'Opportunity deleted successfully');
    }

    /**
     * @OA\Patch(
     *      path="/api/trainer-opportunities/{id}/activate",
     *      operationId="activateTrainerOpportunity",
     *      tags={"Trainer Opportunities"},
     *      summary="Activate existing trainer opportunity",
     *      description="Activates a trainer opportunity",
     *      security={{"sanctum":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          description="Opportunity id",
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
        $opportunity = $this->service->getOpportunity($id);
        $this->authorize('activate', $opportunity);
        
        $this->service->activateOpportunity($id);
        
        return $this->successResponse([], 'Opportunity activated successfully');
    }

    /**
     * @OA\Patch(
     *      path="/api/trainer-opportunities/{id}/deactivate",
     *      operationId="deactivateTrainerOpportunity",
     *      tags={"Trainer Opportunities"},
     *      summary="Deactivate existing trainer opportunity",
     *      description="Deactivates a trainer opportunity",
     *      security={{"sanctum":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          description="Opportunity id",
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
        $opportunity = $this->service->getOpportunity($id);
        $this->authorize('deactivate', $opportunity);
        
        $this->service->deactivateOpportunity($id);
        
        return $this->successResponse([], 'Opportunity deactivated successfully');
    }
}

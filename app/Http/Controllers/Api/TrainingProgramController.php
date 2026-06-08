<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTrainingProgramRequest;
use App\Http\Requests\UpdateTrainingProgramRequest;
use App\Http\Resources\TrainingProgramResource;
use App\Models\TrainingProgram;
use App\Services\TrainingProgramService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

#[OA\Info(version: "1.0.0", title: "Mawthiq API")]
class TrainingProgramController extends Controller
{
    use ApiResponse;

    protected TrainingProgramService $service;

    public function __construct(TrainingProgramService $service)
    {
        $this->service = $service;
    }

    #[OA\Get(path: "/api/training-programs", summary: "Get list of training programs", tags: ["Training Programs"])]
    #[OA\Response(response: 200, description: "Successful operation")]
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', TrainingProgram::class);
        $programs = $this->service->getAllPrograms();
        
        return $this->successResponse(
            TrainingProgramResource::collection($programs)->response()->getData(true),
            'Programs retrieved successfully'
        );
    }

    #[OA\Post(path: "/api/training-programs", summary: "Store new training program", tags: ["Training Programs"], security: [["sanctum" => []]])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['title'],
            properties: [
                new OA\Property(property: 'title', type: 'string', example: 'Full Stack Laravel BootCamp'),
                new OA\Property(property: 'description', type: 'string', example: 'Learn Laravel 12 from scratch.'),
                new OA\Property(property: 'price', type: 'number', example: 1500),
                new OA\Property(property: 'capacity', type: 'integer', example: 50)
            ]
        )
    )]
    #[OA\Response(response: 201, description: "Successful operation")]
    public function store(StoreTrainingProgramRequest $request): JsonResponse
    {
        $this->authorize('create', TrainingProgram::class);
        $program = $this->service->createProgram($request->validated());
        
        return $this->successResponse(
            new TrainingProgramResource($program),
            'Program created successfully',
            201
        );
    }

    #[OA\Get(path: "/api/training-programs/{id}", summary: "Get training program information", tags: ["Training Programs"])]
    #[OA\Parameter(name: "id", in: "path", required: true)]
    #[OA\Response(response: 200, description: "Successful operation")]
    public function show(int $id): JsonResponse
    {
        $program = $this->service->getProgram($id);
        $this->authorize('view', $program);
        
        return $this->successResponse(
            new TrainingProgramResource($program),
            'Program retrieved successfully'
        );
    }

    #[OA\Put(path: "/api/training-programs/{id}", summary: "Update existing training program", tags: ["Training Programs"], security: [["sanctum" => []]])]
    #[OA\Parameter(name: "id", in: "path", required: true)]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'title', type: 'string', example: 'Advanced Laravel BootCamp'),
                new OA\Property(property: 'price', type: 'number', example: 2000)
            ]
        )
    )]
    #[OA\Response(response: 200, description: "Successful operation")]
    public function update(UpdateTrainingProgramRequest $request, int $id): JsonResponse
    {
        $program = $this->service->getProgram($id);
        $this->authorize('update', $program);
        
        $program = $this->service->updateProgram($id, $request->validated());
        
        return $this->successResponse(
            new TrainingProgramResource($program),
            'Program updated successfully'
        );
    }

    #[OA\Delete(path: "/api/training-programs/{id}", summary: "Delete existing training program", tags: ["Training Programs"], security: [["sanctum" => []]])]
    #[OA\Parameter(name: "id", in: "path", required: true)]
    #[OA\Response(response: 200, description: "Successful operation")]
    public function destroy(int $id): JsonResponse
    {
        $program = $this->service->getProgram($id);
        $this->authorize('delete', $program);
        
        $this->service->deleteProgram($id);
        
        return $this->successResponse([], 'Program deleted successfully');
    }

    #[OA\Patch(path: "/api/training-programs/{id}/activate", summary: "Activate existing training program", tags: ["Training Programs"], security: [["sanctum" => []]])]
    #[OA\Parameter(name: "id", in: "path", required: true)]
    #[OA\Response(response: 200, description: "Successful operation")]
    public function activate(int $id): JsonResponse
    {
        $program = $this->service->getProgram($id);
        $this->authorize('activate', $program);
        
        $this->service->activateProgram($id);
        
        return $this->successResponse([], 'Program activated successfully');
    }

    #[OA\Patch(path: "/api/training-programs/{id}/deactivate", summary: "Deactivate existing training program", tags: ["Training Programs"], security: [["sanctum" => []]])]
    #[OA\Parameter(name: "id", in: "path", required: true)]
    #[OA\Response(response: 200, description: "Successful operation")]
    public function deactivate(int $id): JsonResponse
    {
        $program = $this->service->getProgram($id);
        $this->authorize('deactivate', $program);
        
        $this->service->deactivateProgram($id);
        
        return $this->successResponse([], 'Program deactivated successfully');
    }
}

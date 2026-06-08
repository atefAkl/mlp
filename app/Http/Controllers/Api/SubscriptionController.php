<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriptionResource;
use App\Jobs\SendSubscriptionEmailJob;
use App\Models\CompanyPackage;
use App\Models\Country;
use App\Models\TrainerOpportunity;
use App\Models\TrainingProgram;
use App\Models\Subscription;
use App\Models\Skill;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Subscriptions", description: "Subscription Wizard Endpoints")]
class SubscriptionController extends Controller
{
    private function maxUploadKb(): int
    {
        return (int) env('SUBSCRIPTIONS_MAX_UPLOAD_KB', 71680);
    }

    #[OA\Get(path: "/api/subscribe/meta", summary: "Get metadata for subscription wizard", tags: ["Subscriptions"])]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: "training_programs",
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "integer", example: 1),
                            new OA\Property(property: "title", type: "string", example: "الدفعة 12"),
                            new OA\Property(property: "slug", type: "string", example: "batch-12"),
                            new OA\Property(property: "training_type", type: "string", example: "تطوير خلفيات الويب (Backend Dev)"),
                            new OA\Property(property: "duration_weeks", type: "integer", example: 12),
                            new OA\Property(property: "capacity", type: "integer", example: 150),
                            new OA\Property(
                                property: "skills",
                                type: "array",
                                items: new OA\Items(
                                    properties: [
                                        new OA\Property(property: "id", type: "integer", example: 1),
                                        new OA\Property(property: "name", type: "string", example: "PHP")
                                    ]
                                )
                            ),
                            new OA\Property(
                                property: "positions",
                                type: "array",
                                items: new OA\Items(
                                    properties: [
                                        new OA\Property(property: "id", type: "integer", example: 1),
                                        new OA\Property(property: "name", type: "string", example: "Backend Developer")
                                    ]
                                )
                            ),
                            new OA\Property(property: "certificate_available", type: "boolean", example: true),
                            new OA\Property(property: "price", type: "number", example: 0)
                        ]
                    )
                ),
                new OA\Property(
                    property: "trainer_opportunities",
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "integer", example: 1),
                            new OA\Property(property: "title", type: "string", example: "قائد تقني (Tech Lead)"),
                            new OA\Property(property: "slug", type: "string", example: "tech-lead"),
                            new OA\Property(property: "salary_range", type: "string", example: "نسبة"),
                            new OA\Property(
                                property: "skills",
                                type: "array",
                                items: new OA\Items(
                                    properties: [
                                        new OA\Property(property: "id", type: "integer", example: 1),
                                        new OA\Property(property: "name", type: "string", example: "PHP")
                                    ]
                                )
                            ),
                            new OA\Property(
                                property: "positions",
                                type: "array",
                                items: new OA\Items(
                                    properties: [
                                        new OA\Property(property: "id", type: "integer", example: 1),
                                        new OA\Property(property: "name", type: "string", example: "Backend Developer")
                                    ]
                                )
                            )
                        ]
                    )
                ),
                new OA\Property(
                    property: "company_packages",
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "integer", example: 1),
                            new OA\Property(property: "title", type: "string", example: "الباقة الأساسية"),
                            new OA\Property(property: "slug", type: "string", example: "basic-package"),
                            new OA\Property(property: "description", type: "string", example: "مثالية للشركات الناشئة..."),
                            new OA\Property(property: "price", type: "number", example: 1000),
                            new OA\Property(property: "features", type: "array", items: new OA\Items(type: "string"), example: ["توظيف حتى 3 مطورين", "دعم فني لمدة شهر"])
                        ]
                    )
                ),
                new OA\Property(
                    property: "countries",
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "integer", example: 1),
                            new OA\Property(property: "name", type: "string", example: "Saudi Arabia")
                        ]
                    )
                ),
                new OA\Property(
                    property: "interview_times",
                    type: "array",
                    items: new OA\Items(type: "string"),
                    example: ["09:00-10:00", "10:00-11:00", "11:00-12:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"]
                ),
                new OA\Property(
                    property: "skills",
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "integer", example: 1),
                            new OA\Property(property: "name", type: "string", example: "PHP")
                        ]
                    )
                ),
                new OA\Property(
                    property: "positions",
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "integer", example: 1),
                            new OA\Property(property: "name", type: "string", example: "Backend Developer")
                        ]
                    )
                ),
                new OA\Property(
                    property: "links",
                    type: "object",
                    properties: [
                        new OA\Property(property: "terms_and_conditions", type: "string", example: "https://mawthiq.loc/terms"),
                        new OA\Property(property: "privacy_policy", type: "string", example: "https://mawthiq.loc/privacy")
                    ]
                )
            ]
        )
    )]
    public function meta()
    {
        return response()->json([
            'training_programs' => TrainingProgram::with(['skills', 'positions'])->orderBy('id')->get(),
            'trainer_opportunities' => TrainerOpportunity::with(['skills', 'positions'])->orderBy('id')->get(),
            'company_packages' => CompanyPackage::query()->where('status', 'active')->orderBy('id')->get(),
            'countries' => Country::query()->orderBy('name')->get(),
            'interview_times' => [
                '09:00-10:00',
                '10:00-11:00',
                '11:00-12:00',
                '13:00-14:00',
                '14:00-15:00',
                '15:00-16:00',
            ],
            'skills' => Skill::query()->orderBy('name')->get(),
            'positions' => Position::query()->orderBy('name')->get(),
            'links' => [
                'terms_and_conditions' => url('/terms'),
                'privacy_policy' => url('/privacy'),
            ]
        ]);
    }

    #[OA\Post(path: "/api/subscribe", summary: "Submit a new subscription application", tags: ["Subscriptions"])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["type", "email", "full_name", "country_id", "accept_conditions"],
            properties: [
                new OA\Property(property: "type", type: "string", enum: ["trainee", "trainer", "company"], example: "trainee"),
                new OA\Property(property: "email", type: "string", format: "email", example: "user@example.com"),
                new OA\Property(property: "full_name", type: "string", example: "Ahmed Mohamed"),
                new OA\Property(property: "country_id", type: "integer", example: 1),
                new OA\Property(property: "accept_conditions", type: "boolean", example: true),
                new OA\Property(property: "training_program_id", type: "integer", description: "Required for trainee", example: 1),
                new OA\Property(property: "trainer_opportunity_id", type: "integer", description: "Required for trainer", example: 1),
                new OA\Property(property: "company_package_id", type: "integer", description: "Required for company", example: 1),
                new OA\Property(property: "brand_name", type: "string", description: "Required for company", example: "TechCorp"),
                new OA\Property(property: "cr_number", type: "string", description: "Required for company", example: "1010123456"),
                new OA\Property(property: "interview_times", type: "array", items: new OA\Items(type: "string"), description: "Required for trainee and trainer", example: ["09:00-10:00"]),
                new OA\Property(property: "skill_ids", type: "array", items: new OA\Items(type: "integer"), description: "Array of selected skill IDs", example: [1, 2]),
                new OA\Property(property: "position_ids", type: "array", items: new OA\Items(type: "integer"), description: "Array of selected position IDs", example: [1, 3]),
                new OA\Property(property: "extra_information", type: "string", description: "Optional for company")
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: "Subscription submitted successfully",
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: "message", type: "string", example: "Subscription submitted successfully."),
                new OA\Property(property: "subscription_id", type: "string", example: "SUB-ABC123XYZ0"),
                new OA\Property(property: "redirect_url", type: "string", example: "/subscription/SUB-ABC123XYZ0")
            ]
        )
    )]
    #[OA\Response(response: 422, description: "Validation Error")]
    public function store(Request $request)
    {
        $request->validate([
            'type' => ['required', Rule::in(['trainee', 'trainer', 'company'])],
            'email' => 'required|email|max:255',
            'full_name' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'accept_conditions' => 'accepted',
        ]);

        if ($request->type === 'trainee') {
            $request->validate([
                'training_program_id' => 'required|exists:training_programs,id',
                'interview_times' => 'required|array|min:1',
                'interview_times.*' => 'required|string|max:255',
                'skill_ids' => 'nullable|array',
                'skill_ids.*' => 'exists:skills,id',
                'position_ids' => 'nullable|array',
                'position_ids.*' => 'exists:positions,id',
                'cv' => 'nullable|file|mimes:pdf,doc,docx|max:' . $this->maxUploadKb(),
            ]);
        }

        if ($request->type === 'trainer') {
            $request->validate([
                'trainer_opportunity_id' => 'required|exists:trainer_opportunities,id',
                'interview_times' => 'required|array|min:1',
                'interview_times.*' => 'required|string|max:255',
                'skill_ids' => 'nullable|array',
                'skill_ids.*' => 'exists:skills,id',
                'position_ids' => 'nullable|array',
                'position_ids.*' => 'exists:positions,id',
                'cv' => 'required|file|mimes:pdf,doc,docx|max:' . $this->maxUploadKb(),
            ]);
        }

        if ($request->type === 'company') {
            $request->validate([
                'brand_name' => 'required|string|max:255',
                'company_package_id' => 'required|exists:company_packages,id',
                'cr_number' => 'required|string|max:100',
                'extra_information' => 'nullable|string',
                'cr' => 'nullable|file|mimes:pdf,doc,docx,jpeg,png|max:' . $this->maxUploadKb(),
            ]);
        }

        $subscription = DB::transaction(function () use ($request) {
            $subscription = Subscription::create([
                'public_id' => strtoupper('SUB-' . Str::random(10)),
                'type' => $request->type,
                'status' => 'pending',
                'email' => $request->email,
                'full_name' => $request->full_name,
                'country_id' => $request->country_id,
                'accept_conditions' => true,
            ]);

            if ($request->type === 'trainee') {
                $detail = $subscription->traineeDetail()->create([
                    'training_program_id' => $request->training_program_id,
                ]);

                if ($request->has('skill_ids')) {
                    $detail->skills()->sync($request->skill_ids);
                }
                if ($request->has('position_ids')) {
                    $detail->positions()->sync($request->position_ids);
                }

                foreach ($request->interview_times as $slot) {
                    $subscription->timeSlots()->create(['slot_value' => $slot]);
                }

                if ($request->hasFile('cv')) {
                    $path = $request->file('cv')->store('subscriptions/cv');
                    $subscription->files()->create([
                        'file_type' => 'cv',
                        'file_path' => $path,
                        'mime_type' => $request->file('cv')->getClientMimeType(),
                    ]);
                }
            }

            if ($request->type === 'trainer') {
                $detail = $subscription->trainerDetail()->create([
                    'trainer_opportunity_id' => $request->trainer_opportunity_id,
                ]);

                if ($request->has('skill_ids')) {
                    $detail->skills()->sync($request->skill_ids);
                }
                if ($request->has('position_ids')) {
                    $detail->positions()->sync($request->position_ids);
                }

                foreach ($request->interview_times as $slot) {
                    $subscription->timeSlots()->create(['slot_value' => $slot]);
                }

                if ($request->hasFile('cv')) {
                    $path = $request->file('cv')->store('subscriptions/cv');
                    $subscription->files()->create([
                        'file_type' => 'cv',
                        'file_path' => $path,
                        'mime_type' => $request->file('cv')->getClientMimeType(),
                    ]);
                }
            }

            if ($request->type === 'company') {
                $subscription->companyDetail()->create([
                    'brand_name' => $request->brand_name,
                    'company_package_id' => $request->company_package_id,
                    'cr_number' => $request->cr_number,
                    'extra_information' => $request->extra_information,
                ]);

                if ($request->hasFile('cr')) {
                    $path = $request->file('cr')->store('subscriptions/cr');
                    $subscription->files()->create([
                        'file_type' => 'cr',
                        'file_path' => $path,
                        'mime_type' => $request->file('cr')->getClientMimeType(),
                    ]);
                }
            }

            return $subscription;
        });

        SendSubscriptionEmailJob::dispatch($subscription, 'submitted');

        return response()->json([
            'message' => 'Subscription submitted successfully.',
            'subscription_id' => $subscription->public_id,
            'redirect_url' => '/subscription/' . $subscription->public_id,
        ], 201);
    }

    #[OA\Get(path: "/api/subscribe/public/{publicId}", summary: "View subscription public info", tags: ["Subscriptions"])]
    #[OA\Parameter(name: "publicId", in: "path", required: true)]
    #[OA\Response(response: 200, description: "Successful operation")]
    #[OA\Response(response: 404, description: "Not Found")]
    public function showPublic(string $publicId)
    {
        $subscription = Subscription::query()
            ->with([
                'country',
                'traineeDetail.trainingProgram',
                'trainerDetail.trainerOpportunity',
                'companyDetail.companyPackage',
                'timeSlots',
            ])
            ->where('public_id', $publicId)
            ->firstOrFail();

        return response()->json([
            'subscription_id' => $subscription->public_id,
            'message' => 'Please keep this subscription id for future reference.',
            'subscription' => new SubscriptionResource($subscription),
        ]);
    }
}

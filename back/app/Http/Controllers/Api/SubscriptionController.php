<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriptionResource;
use App\Jobs\SendSubscriptionEmailJob;
use App\Models\CompanyField;
use App\Models\Country;
use App\Models\PackageRange;
use App\Models\Position;
use App\Models\Round;
use App\Models\Stack;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SubscriptionController extends Controller
{
    private function maxUploadKb(): int
    {
        return (int) env('SUBSCRIPTIONS_MAX_UPLOAD_KB', 71680);
    }

    public function meta()
    {
        return response()->json([
            'countries' => Country::query()->orderBy('name')->get(),
            'stacks' => Stack::query()->orderBy('name')->get(),
            'positions' => Position::query()->orderBy('name')->get(),
            'rounds' => Round::query()->orderBy('name')->get(),
            'company_fields' => CompanyField::query()->orderBy('name')->get(),
            'package_ranges' => PackageRange::query()->orderBy('id')->get(),
            'interview_times' => [
                '09:00-10:00',
                '10:00-11:00',
                '11:00-12:00',
                '13:00-14:00',
                '14:00-15:00',
                '15:00-16:00',
            ],
        ]);
    }

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
                'stack_id' => 'required|exists:stacks,id',
                'round_id' => 'required|exists:rounds,id',
                'interview_times' => 'required|array|min:1',
                'interview_times.*' => 'required|string|max:255',
                'cv' => 'nullable|file|mimes:pdf,md|max:' . $this->maxUploadKb(),
            ]);
        }

        if ($request->type === 'trainer') {
            $request->validate([
                'position_id' => 'required|exists:positions,id',
                'interview_times' => 'required|array|min:1',
                'interview_times.*' => 'required|string|max:255',
                'cv' => 'required|file|mimes:pdf,md|max:' . $this->maxUploadKb(),
            ]);
        }

        if ($request->type === 'company') {
            $request->validate([
                'brand_name' => 'required|string|max:255',
                'company_field_id' => 'required|exists:company_fields,id',
                'package_range_id' => 'required|exists:package_ranges,id',
                'cr_number' => 'required|string|max:100',
                'extra_information' => 'nullable|string',
                'cr' => 'nullable|file|mimes:pdf,md|max:' . $this->maxUploadKb(),
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
                $subscription->traineeDetail()->create([
                    'stack_id' => $request->stack_id,
                    'round_id' => $request->round_id,
                ]);

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
                $subscription->trainerDetail()->create([
                    'position_id' => $request->position_id,
                ]);

                foreach ($request->interview_times as $slot) {
                    $subscription->timeSlots()->create(['slot_value' => $slot]);
                }

                $path = $request->file('cv')->store('subscriptions/cv');
                $subscription->files()->create([
                    'file_type' => 'cv',
                    'file_path' => $path,
                    'mime_type' => $request->file('cv')->getClientMimeType(),
                ]);
            }

            if ($request->type === 'company') {
                $subscription->companyDetail()->create([
                    'brand_name' => $request->brand_name,
                    'company_field_id' => $request->company_field_id,
                    'package_range_id' => $request->package_range_id,
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

    public function showPublic(string $publicId)
    {
        $subscription = Subscription::query()
            ->with([
                'country',
                'traineeDetail.stack',
                'traineeDetail.round',
                'trainerDetail.position',
                'companyDetail.companyField',
                'companyDetail.packageRange',
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

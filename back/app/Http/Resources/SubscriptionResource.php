<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'public_id' => $this->public_id,
            'type' => $this->type,
            'status' => $this->status,
            'email' => $this->email,
            'full_name' => $this->full_name,
            'country' => [
                'id' => $this->country?->id,
                'name' => $this->country?->name,
            ],
            'scheduled_at' => $this->scheduled_at,
            'status_reason' => $this->status_reason,
            'details' => [
                'trainee' => $this->when($this->traineeDetail, function () {
                    return [
                        'stack' => [
                            'id' => $this->traineeDetail->stack?->id,
                            'name' => $this->traineeDetail->stack?->name,
                        ],
                        'round' => [
                            'id' => $this->traineeDetail->round?->id,
                            'name' => $this->traineeDetail->round?->name,
                        ],
                    ];
                }),
                'trainer' => $this->when($this->trainerDetail, function () {
                    return [
                        'position' => [
                            'id' => $this->trainerDetail->position?->id,
                            'name' => $this->trainerDetail->position?->name,
                        ],
                    ];
                }),
                'company' => $this->when($this->companyDetail, function () {
                    return [
                        'brand_name' => $this->companyDetail->brand_name,
                        'company_field' => [
                            'id' => $this->companyDetail->companyField?->id,
                            'name' => $this->companyDetail->companyField?->name,
                        ],
                        'package_range' => [
                            'id' => $this->companyDetail->packageRange?->id,
                            'name' => $this->companyDetail->packageRange?->name,
                        ],
                        'cr_number' => $this->companyDetail->cr_number,
                        'extra_information' => $this->companyDetail->extra_information,
                    ];
                }),
                'time_slots' => $this->timeSlots->map(fn ($slot) => [
                    'id' => $slot->id,
                    'value' => $slot->slot_value,
                    'is_selected_by_admin' => (bool) $slot->is_selected_by_admin,
                ])->values(),
            ],
            'files' => $this->whenLoaded('files', fn () => $this->files->map(fn ($file) => [
                'id' => $file->id,
                'file_type' => $file->file_type,
                'file_path' => $file->file_path,
                'mime_type' => $file->mime_type,
            ])->values()),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

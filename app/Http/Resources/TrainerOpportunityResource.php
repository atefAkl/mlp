<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrainerOpportunityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'specialization' => $this->specialization,
            'employment_type' => $this->employment_type,
            'experience_level' => $this->experience_level,
            'skills' => $this->whenLoaded('skills'),
            'positions' => $this->whenLoaded('positions'),
            'location_type' => $this->location_type,
            'salary_range' => $this->salary_range,
            'vacancies' => $this->vacancies,
            'application_deadline' => $this->application_deadline?->format('Y-m-d'),
            'status' => $this->status,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}

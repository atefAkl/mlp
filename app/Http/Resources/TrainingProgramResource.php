<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrainingProgramResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'cover_image' => $this->cover_image,
            'training_type' => $this->training_type,
            'project_type' => $this->project_type,
            'tech_stack' => $this->tech_stack,
            'methodology' => $this->methodology,
            'level' => $this->level,
            'duration_weeks' => $this->duration_weeks,
            'weekly_hours' => $this->weekly_hours,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'capacity' => $this->capacity,
            'available_seats' => $this->available_seats,
            'price' => (float) $this->price,
            'discount_price' => $this->discount_price ? (float) $this->discount_price : null,
            'certificate_available' => $this->certificate_available,
            'portfolio_available' => $this->portfolio_available,
            'admission_test_required' => $this->admission_test_required,
            'interview_required' => $this->interview_required,
            'status' => $this->status,
            'published_at' => $this->published_at?->toDateTimeString(),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}

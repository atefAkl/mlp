<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTrainingProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'training_type' => 'nullable|string|max:50',
            'project_type' => 'nullable|string|max:50',
            'skill_ids' => 'nullable|array',
            'skill_ids.*' => 'exists:skills,id',
            'position_ids' => 'nullable|array',
            'position_ids.*' => 'exists:positions,id',
            'methodology' => 'nullable|string|max:100',
            'level' => 'nullable|string|max:50',
            'duration_weeks' => 'nullable|integer|min:1',
            'weekly_hours' => 'nullable|integer|min:1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'capacity' => 'nullable|integer|min:1',
            'available_seats' => 'nullable|integer|min:0|lte:capacity',
            'price' => 'nullable|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lte:price',
            'certificate_available' => 'boolean',
            'portfolio_available' => 'boolean',
            'admission_test_required' => 'boolean',
            'interview_required' => 'boolean',
            'status' => 'nullable|string|in:draft,published,closed',
        ];
    }
}

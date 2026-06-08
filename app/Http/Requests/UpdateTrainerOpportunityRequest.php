<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTrainerOpportunityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'specialization' => 'nullable|string|max:100',
            'employment_type' => 'nullable|string|max:50',
            'experience_level' => 'nullable|string|max:50',
            'required_skills' => 'nullable|array',
            'required_skills.*' => 'string|max:50',
            'location_type' => 'nullable|string|max:50',
            'salary_range' => 'nullable|string|max:100',
            'vacancies' => 'nullable|integer|min:1',
            'application_deadline' => 'nullable|date',
            'status' => 'nullable|string|in:open,closed',
        ];
    }
}

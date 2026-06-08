<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'price' => 'required|numeric|min:0',
            'duration_months' => 'required|integer|min:1',
            'max_trainers' => 'nullable|integer|min:1',
            'max_trainees' => 'nullable|integer|min:1',
            'support_level' => 'nullable|string|max:50',
            'status' => 'nullable|string|in:active,inactive',
        ];
    }
}

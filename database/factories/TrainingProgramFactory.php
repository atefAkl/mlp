<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrainingProgram>
 */
class TrainingProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(4);
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'short_description' => fake()->paragraph(),
            'description' => fake()->text(1000),
            'training_type' => fake()->randomElement(['online', 'onsite', 'hybrid']),
            'project_type' => fake()->word(),
            'methodology' => fake()->randomElement(['agile', 'waterfall', 'scrum']),
            'level' => fake()->randomElement(['beginner', 'intermediate', 'advanced']),
            'duration_weeks' => fake()->numberBetween(4, 24),
            'weekly_hours' => fake()->numberBetween(10, 40),
            'start_date' => fake()->dateTimeBetween('+1 week', '+2 months')->format('Y-m-d'),
            'end_date' => fake()->dateTimeBetween('+3 months', '+6 months')->format('Y-m-d'),
            'capacity' => fake()->numberBetween(10, 50),
            'available_seats' => fake()->numberBetween(0, 50),
            'price' => fake()->randomFloat(2, 500, 5000),
            'discount_price' => fake()->optional(0.3)->randomFloat(2, 100, 400),
            'certificate_available' => fake()->boolean(),
            'portfolio_available' => fake()->boolean(),
            'admission_test_required' => fake()->boolean(),
            'interview_required' => fake()->boolean(),
            'status' => fake()->randomElement(['draft', 'published', 'closed']),
            'published_at' => fake()->optional()->dateTime(),
        ];
    }
}

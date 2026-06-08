<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrainerOpportunity>
 */
class TrainerOpportunityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->jobTitle(),
            'description' => fake()->text(1000),
            'specialization' => fake()->randomElement(['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile']),
            'employment_type' => fake()->randomElement(['full_time', 'part_time', 'freelance']),
            'experience_level' => fake()->randomElement(['junior', 'mid', 'senior']),
            'location_type' => fake()->randomElement(['remote', 'onsite', 'hybrid']),
            'salary_range' => fake()->randomElement(['$50k - $70k', '$70k - $100k', '$100k+']),
            'vacancies' => fake()->numberBetween(1, 5),
            'application_deadline' => fake()->dateTimeBetween('+1 week', '+2 months')->format('Y-m-d'),
            'status' => fake()->randomElement(['open', 'closed']),
        ];
    }
}

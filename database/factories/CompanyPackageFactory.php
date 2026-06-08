<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CompanyPackage>
 */
class CompanyPackageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true) . ' Package';
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->text(500),
            'features' => fake()->randomElements(['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E'], 3),
            'price' => fake()->randomFloat(2, 100, 2000),
            'duration_months' => fake()->randomElement([1, 3, 6, 12]),
            'max_trainers' => fake()->numberBetween(1, 10),
            'max_trainees' => fake()->numberBetween(10, 100),
            'support_level' => fake()->randomElement(['basic', 'priority', 'dedicated']),
            'status' => fake()->randomElement(['active', 'inactive']),
        ];
    }
}

<?php

namespace Database\Seeders;

use App\Models\CompanyField;
use App\Models\Country;
use App\Models\PackageRange;
use App\Models\Position;
use App\Models\Round;
use App\Models\Stack;
use Illuminate\Database\Seeder;

class SubscriptionReferenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countries = ['Egypt', 'Saudi Arabia', 'UAE', 'Jordan'];
        $stacks = ['Laravel', 'MERN', 'MEAN', 'Django'];
        $rounds = ['Round 1', 'Round 2', 'Round 3'];
        $companyFields = ['Software', 'Healthcare', 'FinTech', 'E-commerce'];
        $packageRanges = ['1-10', '11-50', '51-100', '101+'];
        $positions = ['Mentor', 'Trainee', 'Senior Trainer', 'Technical Trainer'];

        foreach ($countries as $name) {
            Country::query()->updateOrCreate(['name' => $name]);
        }

        foreach ($stacks as $name) {
            Stack::query()->updateOrCreate(['name' => $name]);
        }

        foreach ($rounds as $name) {
            Round::query()->updateOrCreate(['name' => $name]);
        }

        foreach ($companyFields as $name) {
            CompanyField::query()->updateOrCreate(['name' => $name]);
        }

        foreach ($packageRanges as $name) {
            PackageRange::query()->updateOrCreate(['name' => $name]);
        }

        foreach ($positions as $name) {
            Position::query()->updateOrCreate(['name' => $name]);
        }
    }
}

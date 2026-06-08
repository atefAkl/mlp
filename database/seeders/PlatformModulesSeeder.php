<?php

namespace Database\Seeders;

use App\Models\CompanyPackage;
use App\Models\TrainerOpportunity;
use App\Models\TrainingProgram;
use Illuminate\Database\Seeder;

class PlatformModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TrainingProgram::factory(10)->create();
        TrainerOpportunity::factory(10)->create();
        CompanyPackage::factory(10)->create();
    }
}

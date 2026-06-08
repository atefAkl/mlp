<?php

namespace Database\Seeders;

use App\Models\CompanyPackage;
use App\Models\Country;
use App\Models\TrainerOpportunity;
use App\Models\TrainingProgram;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Countries
        $countries = [
            "Saudi Arabia", "Jordan", "UAE", "Kuwait", "Qatar", "Bahrain",
            "Oman", "Egypt", "Palestine", "Iraq", "Yemen", "Lebanon",
            "Syria", "Morocco", "Tunisia", "Algeria", "Libya", "Sudan", "Other"
        ];
        foreach ($countries as $c) {
            Country::firstOrCreate(['name' => $c]);
        }

        // Seed Skills and Positions
        $skillsList = ['PHP', 'MySQL', 'React', 'TailwindCSS', 'DevOps', 'GitHub', 'RESTful API', 'Axios'];
        $positionsList = ['Backend Developer', 'Frontend Developer', 'System Analyst', 'UI/UX Designer', 'Tester', 'DevOps Engineer', 'Team Leader', 'Tech Lead', 'Accountant'];
        
        $skillsMap = [];
        foreach ($skillsList as $s) {
            $skillsMap[$s] = \App\Models\Skill::firstOrCreate(['name' => $s]);
        }

        $positionsMap = [];
        foreach ($positionsList as $p) {
            $positionsMap[$p] = \App\Models\Position::firstOrCreate(['name' => $p]);
        }

        // 2. Training Programs (Trainees)
        $programs = [
            [
                'title' => 'الدفعة 12',
                'slug' => 'batch-12',
                'training_type' => 'تطوير خلفيات الويب (Backend Dev)',
                'duration_weeks' => 12,
                'capacity' => 150,
                'certificate_available' => true,
                'price' => 0, // مجاني
                '_skills' => ['PHP', 'MySQL', 'RESTful API', 'DevOps', 'GitHub'],
                '_positions' => ['Backend Developer', 'System Analyst', 'DevOps Engineer']
            ],
            [
                'title' => 'الدفعة 13',
                'slug' => 'batch-13',
                'training_type' => 'تطوير فرونت الويب (Frontend Dev)',
                'duration_weeks' => 16,
                'capacity' => 250,
                'certificate_available' => true,
                'price' => 0, // مجاني
                '_skills' => ['React', 'TailwindCSS', 'Axios', 'GitHub'],
                '_positions' => ['Frontend Developer', 'UI/UX Designer', 'Tester']
            ]
        ];

        foreach ($programs as $prog) {
            $sList = $prog['_skills'];
            $pList = $prog['_positions'];
            unset($prog['_skills'], $prog['_positions']);

            $tp = TrainingProgram::updateOrCreate(['slug' => $prog['slug']], $prog);
            $tp->skills()->sync(collect($sList)->map(fn($s) => $skillsMap[$s]->id)->toArray());
            $tp->positions()->sync(collect($pList)->map(fn($p) => $positionsMap[$p]->id)->toArray());
        }

        // 3. Trainer Opportunities
        $opportunities = [
            [
                'title' => 'قائد تقني (Tech Lead)',
                'description' => 'خبرة لا تقل عن 5 سنوات في تطوير البرمجيات...',
                'employment_type' => 'جزئي (4 ساعات)',
                'salary_range' => 'نسبة',
                '_skills' => ['PHP', 'React', 'DevOps'],
                '_positions' => ['Tech Lead']
            ],
            [
                'title' => 'قائد فريق (Team Leader)',
                'description' => 'خبرة 3 سنوات على الأقل...',
                'employment_type' => 'جزئي (4 ساعات)',
                'salary_range' => 'نسبة',
                '_skills' => ['PHP', 'MySQL', 'GitHub'],
                '_positions' => ['Team Leader']
            ],
            [
                'title' => 'محاسب',
                'description' => 'خبرة في المحاسبة المالية...',
                'employment_type' => 'جزئي (4 ساعات)',
                'salary_range' => 'ثابت',
                '_skills' => [],
                '_positions' => ['Accountant']
            ]
        ];

        foreach ($opportunities as $opp) {
            $sList = $opp['_skills'];
            $pList = $opp['_positions'];
            unset($opp['_skills'], $opp['_positions']);

            $to = TrainerOpportunity::updateOrCreate(['title' => $opp['title']], $opp);
            $to->skills()->sync(collect($sList)->map(fn($s) => $skillsMap[$s]->id)->toArray());
            $to->positions()->sync(collect($pList)->map(fn($p) => $positionsMap[$p]->id)->toArray());
        }

        // 4. Company Packages
        $packages = [
            [
                'name' => 'الباقة الأساسية',
                'slug' => 'basic-package',
                'description' => 'مثالية للشركات الناشئة التي تبحث عن مطورين مبتدئين.',
                'price' => 1000,
                'features' => ['توظيف حتى 3 مطورين', 'دعم فني لمدة شهر', 'وصول لبيانات الخريجين الأساسية'],
                'status' => 'active',
            ],
            [
                'name' => 'الباقة المتقدمة',
                'slug' => 'advanced-package',
                'description' => 'تناسب الشركات المتوسطة لتوظيف فريق تقني متكامل.',
                'price' => 5000,
                'features' => ['توظيف عدد غير محدود', 'دعم فني لمدة سنة', 'مقابلات حصرية', 'توصيات مخصصة'],
                'status' => 'active',
            ],
        ];

        foreach ($packages as $pkg) {
            CompanyPackage::updateOrCreate(
                ['slug' => $pkg['slug']],
                $pkg
            );
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $mentorPos = \App\Models\Position::firstOrCreate(['name' => 'Mentor']);
        $traineePos = \App\Models\Position::firstOrCreate(['name' => 'Trainee']);

        $mentor = User::query()->updateOrCreate(
            ['email' => 'mentor@example.com'],
            [
                'name' => 'أحمد الموجه (Mentor)',
                'password' => Hash::make('password'),
                'position_id' => $mentorPos->id,
            ]
        );

        $trainee = User::query()->updateOrCreate(
            ['email' => 'trainee@example.com'],
            [
                'name' => 'محمد المتدرب (Trainee)',
                'password' => Hash::make('password'),
                'position_id' => $traineePos->id,
            ]
        );

        $this->call(AdminSeeder::class);

        $this->call([
            RolesAndPermissionsSeeder::class,
            SubscriptionReferenceSeeder::class,
            DemoDataSeeder::class,
            PlatformModulesSeeder::class,
        ]);

        $epic = \App\Models\Task::create([
            'title' => 'Frontend Redesign Epic',
            'description' => 'Completely overhaul the frontend using Tailwind CSS.',
            'type' => 'Epic',
            'status' => 'In Progress',
            'trainee_id' => $trainee->id,
            'mentor_id' => $mentor->id,
        ]);

        $story = \App\Models\Task::create([
            'title' => 'Task Management UI',
            'description' => 'Build the Kanban and List views for the tasks page.',
            'type' => 'User Story',
            'status' => 'In Progress',
            'parent_id' => $epic->id,
            'trainee_id' => $trainee->id,
            'mentor_id' => $mentor->id,
        ]);

        $task1 = \App\Models\Task::create([
            'title' => 'Design Kanban Board',
            'description' => 'Use Tailwind grid to layout 4 columns.',
            'type' => 'Task',
            'status' => 'Completed',
            'parent_id' => $story->id,
            'trainee_id' => $trainee->id,
            'mentor_id' => $mentor->id,
        ]);

        $task2 = \App\Models\Task::create([
            'title' => 'Implement Modal',
            'description' => 'Build the complex modal for task details.',
            'type' => 'Task',
            'status' => 'In Progress',
            'parent_id' => $story->id,
            'trainee_id' => $trainee->id,
            'mentor_id' => $mentor->id,
        ]);
    }
}

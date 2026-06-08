<?php

namespace Tests\Feature;

use App\Models\TrainingProgram;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TrainingProgramApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // create permissions if not exists
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'manage training programs']);
    }

    public function test_can_list_training_programs()
    {
        TrainingProgram::factory()->count(3)->create();

        $response = $this->getJson('/api/training-programs');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'data' => [
                             '*' => ['id', 'title', 'slug']
                         ],
                         'links',
                         'meta'
                     ]
                 ]);
    }

    public function test_can_create_training_program()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('manage training programs');

        $data = [
            'title' => 'Laravel Advanced Course',
            'training_type' => 'online',
            'price' => 500
        ];

        $response = $this->actingAs($user)->postJson('/api/training-programs', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'Laravel Advanced Course']);
                 
        $this->assertDatabaseHas('training_programs', ['title' => 'Laravel Advanced Course']);
    }

    public function test_unauthorized_user_cannot_create_training_program()
    {
        $user = User::factory()->create();

        $data = [
            'title' => 'Laravel Advanced Course',
        ];

        $response = $this->actingAs($user)->postJson('/api/training-programs', $data);

        $response->assertStatus(403);
    }
}

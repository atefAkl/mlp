<?php

namespace Tests\Feature;

use App\Models\TrainerOpportunity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrainerOpportunityApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'manage trainer opportunities']);
    }

    public function test_can_list_trainer_opportunities()
    {
        TrainerOpportunity::factory()->count(3)->create();

        $response = $this->getJson('/api/trainer-opportunities');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'data' => [
                             '*' => ['id', 'title']
                         ],
                         'links',
                         'meta'
                     ]
                 ]);
    }

    public function test_can_create_trainer_opportunity()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('manage trainer opportunities');

        $data = [
            'title' => 'Senior Backend Developer',
            'specialization' => 'Backend',
        ];

        $response = $this->actingAs($user)->postJson('/api/trainer-opportunities', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'Senior Backend Developer']);
    }
}

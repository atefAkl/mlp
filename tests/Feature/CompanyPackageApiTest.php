<?php

namespace Tests\Feature;

use App\Models\CompanyPackage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyPackageApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'manage company packages']);
    }

    public function test_can_list_company_packages()
    {
        CompanyPackage::factory()->count(3)->create();

        $response = $this->getJson('/api/company-packages');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'data' => [
                             '*' => ['id', 'name', 'slug']
                         ],
                         'links',
                         'meta'
                     ]
                 ]);
    }

    public function test_can_create_company_package()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('manage company packages');

        $data = [
            'name' => 'Gold Package',
            'price' => 1500,
            'duration_months' => 6
        ];

        $response = $this->actingAs($user)->postJson('/api/company-packages', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['name' => 'Gold Package']);
    }
}

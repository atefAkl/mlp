<?php

namespace Tests\Feature;

use App\Models\Country;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class ReferenceDataManagementTest extends TestCase
{
    use RefreshDatabase;

    private function actingAdmin(bool $withPermission = true): User
    {
        $admin = User::factory()->create();

        if ($withPermission) {
            $permission = Permission::query()->firstOrCreate(
                ['name' => 'manage_settings'],
                ['guard_name' => 'web']
            );

            $admin->givePermissionTo($permission);
        }

        Sanctum::actingAs($admin);

        return $admin;
    }

    public function test_authorized_admin_can_crud_reference_data(): void
    {
        $this->actingAdmin();

        $createResponse = $this->postJson('/api/admin/reference-data/countries', [
            'name' => 'Spain',
        ]);

        $createResponse->assertCreated()->assertJsonFragment([
            'name' => 'Spain',
        ]);

        $countryId = (int) $createResponse->json('id');

        $updateResponse = $this->putJson('/api/admin/reference-data/countries/' . $countryId, [
            'name' => 'Portugal',
        ]);

        $updateResponse->assertOk()->assertJsonFragment([
            'name' => 'Portugal',
        ]);

        $this->assertDatabaseHas('countries', ['name' => 'Portugal']);

        $deleteResponse = $this->deleteJson('/api/admin/reference-data/countries/' . $countryId);
        $deleteResponse->assertOk();

        $this->assertDatabaseMissing('countries', ['id' => $countryId]);
    }

    public function test_unauthorized_admin_cannot_manage_reference_data(): void
    {
        $this->actingAdmin(false);

        $response = $this->postJson('/api/admin/reference-data/countries', [
            'name' => 'Italy',
        ]);

        $response->assertForbidden();
    }

    public function test_index_returns_reference_data_payload(): void
    {
        Country::query()->create(['name' => 'Egypt']);

        $this->actingAdmin();

        $response = $this->getJson('/api/admin/reference-data');

        $response->assertOk()->assertJsonStructure([
            'countries',
            'stacks',
            'positions',
            'rounds',
            'company_fields',
            'package_ranges',
        ]);
    }
}

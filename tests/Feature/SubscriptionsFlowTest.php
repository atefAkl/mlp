<?php

namespace Tests\Feature;

use App\Jobs\SendSubscriptionEmailJob;
use App\Models\CompanyField;
use App\Models\Country;
use App\Models\PackageRange;
use App\Models\Round;
use App\Models\Stack;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class SubscriptionsFlowTest extends TestCase
{
    use RefreshDatabase;

    private function actingAdmin(bool $withPermission = true): User
    {
        $admin = User::factory()->create([
            'email' => 'admin-flow@example.com',
        ]);

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

    public function test_public_can_submit_trainee_subscription_and_dispatch_email_job(): void
    {
        Queue::fake();

        $country = Country::query()->create(['name' => 'Egypt']);
        $stack = Stack::query()->create(['name' => 'Laravel']);
        $round = Round::query()->create(['name' => 'Round 1']);

        $response = $this->postJson('/api/subscriptions', [
            'type' => 'trainee',
            'email' => 'trainee@example.com',
            'full_name' => 'Test Trainee',
            'country_id' => $country->id,
            'accept_conditions' => true,
            'stack_id' => $stack->id,
            'round_id' => $round->id,
            'interview_times' => ['09:00-10:00', '10:00-11:00'],
        ]);

        $response->assertCreated()->assertJsonStructure([
            'message',
            'subscription_id',
            'redirect_url',
        ]);

        $this->assertDatabaseHas('subscriptions', [
            'type' => 'trainee',
            'email' => 'trainee@example.com',
            'status' => 'pending',
        ]);

        Queue::assertPushed(SendSubscriptionEmailJob::class, function (SendSubscriptionEmailJob $job) {
            return $job->eventType === 'submitted';
        });
    }

    public function test_public_summary_returns_subscription_resource_contract(): void
    {
        $country = Country::query()->create(['name' => 'Summary Country']);
        $subscription = Subscription::query()->create([
            'public_id' => 'SUB-SUMMARY-001',
            'type' => 'company',
            'status' => 'pending',
            'email' => 'summary@example.com',
            'full_name' => 'Summary User',
            'country_id' => $country->id,
            'accept_conditions' => true,
        ]);

        $response = $this->getJson('/api/subscriptions/public/' . $subscription->public_id);

        $response->assertOk()->assertJsonStructure([
            'subscription_id',
            'message',
            'subscription' => [
                'id',
                'public_id',
                'type',
                'status',
                'email',
                'full_name',
                'country',
                'details',
                'created_at',
                'updated_at',
            ],
        ]);
    }

    public function test_admin_can_view_stats_and_update_status_with_email_job(): void
    {
        Queue::fake();

        $country = Country::query()->create(['name' => 'Jordan']);
        $subscription = Subscription::query()->create([
            'public_id' => 'SUB-TEST-001',
            'type' => 'trainer',
            'status' => 'pending',
            'email' => 'trainer@example.com',
            'full_name' => 'Trainer User',
            'country_id' => $country->id,
            'accept_conditions' => true,
        ]);

        $this->actingAdmin();

        $statsResponse = $this->getJson('/api/admin/subscribers/stats');

        $statsResponse->assertOk()->assertJsonStructure([
            'total_subscribers',
            'totals_by_type',
            'totals_by_status',
            'daily_counts_last_7_days',
        ]);

        $updateResponse = $this->patchJson('/api/admin/subscribers/' . $subscription->id . '/status', [
            'status' => 'accepted',
            'scheduled_at' => now()->addDay()->toDateTimeString(),
        ]);

        $updateResponse->assertOk()->assertJsonFragment([
            'message' => 'Subscriber status updated successfully.',
        ]);

        $this->assertDatabaseHas('subscriptions', [
            'id' => $subscription->id,
            'status' => 'accepted',
        ]);

        Queue::assertPushed(SendSubscriptionEmailJob::class, function (SendSubscriptionEmailJob $job) {
            return $job->eventType === 'accepted';
        });
    }

    public function test_update_status_requires_scheduled_at_for_accepted(): void
    {
        Queue::fake();

        $country = Country::query()->create(['name' => 'KSA']);
        $subscription = Subscription::query()->create([
            'public_id' => 'SUB-TEST-ACCEPT-001',
            'type' => 'trainer',
            'status' => 'pending',
            'email' => 'trainer2@example.com',
            'full_name' => 'Trainer Two',
            'country_id' => $country->id,
            'accept_conditions' => true,
        ]);

        $this->actingAdmin();

        $response = $this->patchJson('/api/admin/subscribers/' . $subscription->id . '/status', [
            'status' => 'accepted',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['scheduled_at']);

        Queue::assertNothingPushed();
    }

    public function test_admin_can_bulk_update_status_and_dispatch_jobs(): void
    {
        Queue::fake();

        $country = Country::query()->create(['name' => 'UAE']);
        $one = Subscription::query()->create([
            'public_id' => 'SUB-BULK-001',
            'type' => 'trainee',
            'status' => 'pending',
            'email' => 'bulk1@example.com',
            'full_name' => 'Bulk One',
            'country_id' => $country->id,
            'accept_conditions' => true,
        ]);
        $two = Subscription::query()->create([
            'public_id' => 'SUB-BULK-002',
            'type' => 'company',
            'status' => 'pending',
            'email' => 'bulk2@example.com',
            'full_name' => 'Bulk Two',
            'country_id' => $country->id,
            'accept_conditions' => true,
        ]);

        $this->actingAdmin();

        $response = $this->patchJson('/api/admin/subscribers/bulk-status', [
            'ids' => [$one->id, $two->id],
            'status' => 'maybe',
            'reason' => 'Need additional details',
        ]);

        $response->assertOk()->assertJsonFragment([
            'updated_count' => 2,
        ]);

        $this->assertDatabaseHas('subscriptions', [
            'id' => $one->id,
            'status' => 'maybe',
        ]);
        $this->assertDatabaseHas('subscriptions', [
            'id' => $two->id,
            'status' => 'maybe',
        ]);

        Queue::assertPushed(SendSubscriptionEmailJob::class, 2);
    }

    public function test_admin_subscribers_stats_forbidden_without_permission(): void
    {
        $this->actingAdmin(false);

        $response = $this->getJson('/api/admin/subscribers/stats');

        $response->assertForbidden();
    }

    public function test_trainer_subscription_requires_pdf_or_md_cv_file(): void
    {
        Queue::fake();

        $country = Country::query()->create(['name' => 'Bahrain']);

        $response = $this->postJson('/api/subscriptions', [
            'type' => 'trainer',
            'email' => 'trainer-validation@example.com',
            'full_name' => 'Trainer Validation',
            'country_id' => $country->id,
            'accept_conditions' => true,
            'position_id' => 1,
            'interview_times' => ['09:00-10:00'],
            'cv' => UploadedFile::fake()->create('cv.txt', 12, 'text/plain'),
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['cv']);
        Queue::assertNothingPushed();
    }

    public function test_trainer_subscription_accepts_valid_cv_and_stores_file(): void
    {
        Queue::fake();
        Storage::fake('local');

        $country = Country::query()->create(['name' => 'Qatar']);
        // Position is required by validation and seeded in app seeder, so ensure one exists.
        $positionId = \App\Models\Position::query()->firstOrCreate(['name' => 'Technical Trainer'])->id;

        $response = $this->postJson('/api/subscriptions', [
            'type' => 'trainer',
            'email' => 'trainer-ok@example.com',
            'full_name' => 'Trainer OK',
            'country_id' => $country->id,
            'accept_conditions' => true,
            'position_id' => $positionId,
            'interview_times' => ['09:00-10:00'],
            'cv' => UploadedFile::fake()->create('cv.pdf', 50, 'application/pdf'),
        ]);

        $response->assertCreated();

        $subscription = Subscription::query()->where('email', 'trainer-ok@example.com')->firstOrFail();
        $this->assertDatabaseHas('subscription_files', [
            'subscription_id' => $subscription->id,
            'file_type' => 'cv',
        ]);

        $storedPath = $subscription->files()->where('file_type', 'cv')->value('file_path');
        Storage::disk('local')->assertExists($storedPath);

        Queue::assertPushed(SendSubscriptionEmailJob::class, function (SendSubscriptionEmailJob $job) {
            return $job->eventType === 'submitted';
        });
    }

    public function test_admin_can_view_trends_with_filters(): void
    {
        $country = Country::query()->create(['name' => 'Oman']);

        $one = Subscription::query()->create([
            'public_id' => 'SUB-TREND-001',
            'type' => 'company',
            'status' => 'pending',
            'email' => 'trend1@example.com',
            'full_name' => 'Trend One',
            'country_id' => $country->id,
            'accept_conditions' => true,
        ]);
        $two = Subscription::query()->create([
            'public_id' => 'SUB-TREND-002',
            'type' => 'company',
            'status' => 'accepted',
            'email' => 'trend2@example.com',
            'full_name' => 'Trend Two',
            'country_id' => $country->id,
            'accept_conditions' => true,
        ]);

        Subscription::query()->whereKey($one->id)->update(['created_at' => now()->subDays(2)]);
        Subscription::query()->whereKey($two->id)->update(['created_at' => now()->subDay()]);

        $this->actingAdmin();

        $response = $this->getJson('/api/admin/subscribers/trends?interval=daily&days=7&type=company&status=accepted');

        $response->assertOk()->assertJsonFragment([
            'interval' => 'daily',
        ])->assertJsonPath('filters.type', 'company')
            ->assertJsonPath('filters.status', 'accepted');

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_admin_can_get_grouped_subscribers_view(): void
    {
        $country = Country::query()->create(['name' => 'Grouped Country']);

        Subscription::query()->create([
            'public_id' => 'SUB-GROUP-001',
            'type' => 'trainee',
            'status' => 'pending',
            'email' => 'group1@example.com',
            'full_name' => 'Group One',
            'country_id' => $country->id,
            'accept_conditions' => true,
        ]);
        Subscription::query()->create([
            'public_id' => 'SUB-GROUP-002',
            'type' => 'trainer',
            'status' => 'accepted',
            'email' => 'group2@example.com',
            'full_name' => 'Group Two',
            'country_id' => $country->id,
            'accept_conditions' => true,
        ]);

        $this->actingAdmin();

        $response = $this->getJson('/api/admin/subscribers/grouped?per_type_limit=10');

        $response->assertOk()->assertJsonStructure([
            'filters',
            'groups' => [
                'trainee' => ['total', 'items'],
                'trainer' => ['total', 'items'],
                'company' => ['total', 'items'],
            ],
        ]);
    }

    public function test_admin_selection_helper_supports_select_all_none_and_invert(): void
    {
        $country = Country::query()->create(['name' => 'Select Country']);

        $a = Subscription::query()->create([
            'public_id' => 'SUB-SEL-001',
            'type' => 'company',
            'status' => 'pending',
            'email' => 'sel1@example.com',
            'full_name' => 'Select One',
            'country_id' => $country->id,
            'accept_conditions' => true,
        ]);
        $b = Subscription::query()->create([
            'public_id' => 'SUB-SEL-002',
            'type' => 'company',
            'status' => 'pending',
            'email' => 'sel2@example.com',
            'full_name' => 'Select Two',
            'country_id' => $country->id,
            'accept_conditions' => true,
        ]);

        $this->actingAdmin();

        $selectAll = $this->postJson('/api/admin/subscribers/selection', [
            'action' => 'select_all',
            'type' => 'company',
        ]);

        $selectAll->assertOk()->assertJsonPath('selected_count', 2);

        $invert = $this->postJson('/api/admin/subscribers/selection', [
            'action' => 'invert',
            'type' => 'company',
            'selected_ids' => [$a->id],
        ]);

        $invert->assertOk()->assertJsonPath('selected_count', 1);
        $this->assertSame([$b->id], $invert->json('selected_ids'));

        $selectNone = $this->postJson('/api/admin/subscribers/selection', [
            'action' => 'select_none',
            'type' => 'company',
            'selected_ids' => [$a->id, $b->id],
        ]);

        $selectNone->assertOk()->assertJsonPath('selected_count', 0);
    }

    public function test_company_subscription_rejects_invalid_cr_file_type(): void
    {
        Queue::fake();

        $country = Country::query()->create(['name' => 'Kuwait']);
        $companyField = CompanyField::query()->create(['name' => 'FinTech']);
        $packageRange = PackageRange::query()->create(['name' => '1-10']);

        $response = $this->postJson('/api/subscriptions', [
            'type' => 'company',
            'email' => 'company-invalid-cr@example.com',
            'full_name' => 'Company Invalid',
            'country_id' => $country->id,
            'accept_conditions' => true,
            'brand_name' => 'BrandX',
            'company_field_id' => $companyField->id,
            'package_range_id' => $packageRange->id,
            'cr_number' => 'CR-001',
            'cr' => UploadedFile::fake()->create('cr.txt', 20, 'text/plain'),
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['cr']);
        Queue::assertNothingPushed();
    }

    public function test_company_subscription_rejects_oversized_cr_file(): void
    {
        Queue::fake();

        $maxUploadKb = (int) env('SUBSCRIPTIONS_MAX_UPLOAD_KB', 71680);

        $country = Country::query()->create(['name' => 'Lebanon']);
        $companyField = CompanyField::query()->create(['name' => 'Healthcare']);
        $packageRange = PackageRange::query()->create(['name' => '11-50']);

        $response = $this->postJson('/api/subscriptions', [
            'type' => 'company',
            'email' => 'company-big-cr@example.com',
            'full_name' => 'Company Big',
            'country_id' => $country->id,
            'accept_conditions' => true,
            'brand_name' => 'BrandY',
            'company_field_id' => $companyField->id,
            'package_range_id' => $packageRange->id,
            'cr_number' => 'CR-002',
            'cr' => UploadedFile::fake()->create('cr.pdf', $maxUploadKb + 1, 'application/pdf'),
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['cr']);
        Queue::assertNothingPushed();
    }

    public function test_company_subscription_accepts_valid_cr_and_stores_file(): void
    {
        Queue::fake();
        Storage::fake('local');

        $country = Country::query()->create(['name' => 'Morocco']);
        $companyField = CompanyField::query()->create(['name' => 'Software']);
        $packageRange = PackageRange::query()->create(['name' => '51-100']);

        $response = $this->postJson('/api/subscriptions', [
            'type' => 'company',
            'email' => 'company-ok@example.com',
            'full_name' => 'Company Ok',
            'country_id' => $country->id,
            'accept_conditions' => true,
            'brand_name' => 'BrandZ',
            'company_field_id' => $companyField->id,
            'package_range_id' => $packageRange->id,
            'cr_number' => 'CR-003',
            'cr' => UploadedFile::fake()->create('cr.pdf', 100, 'application/pdf'),
        ]);

        $response->assertCreated();

        $subscription = Subscription::query()->where('email', 'company-ok@example.com')->firstOrFail();
        $this->assertDatabaseHas('subscription_files', [
            'subscription_id' => $subscription->id,
            'file_type' => 'cr',
        ]);

        $storedPath = $subscription->files()->where('file_type', 'cr')->value('file_path');
        Storage::disk('local')->assertExists($storedPath);

        Queue::assertPushed(SendSubscriptionEmailJob::class, function (SendSubscriptionEmailJob $job) {
            return $job->eventType === 'submitted';
        });
    }

    public function test_admin_can_resend_subscription_email(): void
    {
        Queue::fake();

        $country = Country::query()->create(['name' => 'Tunisia']);
        $subscription = Subscription::query()->create([
            'public_id' => 'SUB-RESEND-001',
            'type' => 'trainer',
            'status' => 'accepted',
            'email' => 'resend@example.com',
            'full_name' => 'Resend User',
            'country_id' => $country->id,
            'accept_conditions' => true,
            'scheduled_at' => now()->addDays(2),
        ]);

        $this->actingAdmin();

        $response = $this->postJson('/api/admin/subscribers/' . $subscription->id . '/resend-email', [
            'event_type' => 'accepted',
        ]);

        $response->assertOk()->assertJsonFragment([
            'event_type' => 'accepted',
        ]);

        Queue::assertPushed(SendSubscriptionEmailJob::class, function (SendSubscriptionEmailJob $job) use ($subscription) {
            return $job->subscription->id === $subscription->id && $job->eventType === 'accepted';
        });
    }

    public function test_resend_email_forbidden_without_permission(): void
    {
        Queue::fake();

        $country = Country::query()->create(['name' => 'Algeria']);
        $subscription = Subscription::query()->create([
            'public_id' => 'SUB-RESEND-002',
            'type' => 'company',
            'status' => 'maybe',
            'email' => 'resend2@example.com',
            'full_name' => 'Resend Two',
            'country_id' => $country->id,
            'accept_conditions' => true,
        ]);

        $this->actingAdmin(false);

        $response = $this->postJson('/api/admin/subscribers/' . $subscription->id . '/resend-email');

        $response->assertForbidden();
        Queue::assertNothingPushed();
    }
}

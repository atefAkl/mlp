<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('stacks', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('rounds', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('company_fields', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('package_ranges', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('public_id')->unique();
            $table->enum('type', ['trainee', 'trainer', 'company']);
            $table->enum('status', ['pending', 'accepted', 'rejected', 'maybe'])->default('pending');
            $table->string('email')->index();
            $table->string('full_name');
            $table->foreignId('country_id')->constrained('countries')->cascadeOnDelete();
            $table->boolean('accept_conditions');
            $table->dateTime('scheduled_at')->nullable();
            $table->text('status_reason')->nullable();
            $table->timestamps();
        });

        Schema::create('subscription_trainee_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->unique()->constrained('subscriptions')->cascadeOnDelete();
            $table->foreignId('training_program_id')->constrained('training_programs')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('subscription_trainer_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->unique()->constrained('subscriptions')->cascadeOnDelete();
            $table->foreignId('trainer_opportunity_id')->constrained('trainer_opportunities')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('subscription_company_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->unique()->constrained('subscriptions')->cascadeOnDelete();
            $table->string('brand_name');
            $table->foreignId('company_package_id')->constrained('company_packages')->cascadeOnDelete();
            $table->string('cr_number');
            $table->text('extra_information')->nullable();
            $table->timestamps();
        });

        Schema::create('subscription_time_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained('subscriptions')->cascadeOnDelete();
            $table->string('slot_value');
            $table->boolean('is_selected_by_admin')->default(false);
            $table->timestamps();
        });

        Schema::create('subscription_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained('subscriptions')->cascadeOnDelete();
            $table->enum('file_type', ['cv', 'cr']);
            $table->string('file_path');
            $table->string('mime_type')->nullable();
            $table->timestamps();
        });

        Schema::create('subscription_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained('subscriptions')->cascadeOnDelete();
            $table->enum('from_status', ['pending', 'accepted', 'rejected', 'maybe']);
            $table->enum('to_status', ['pending', 'accepted', 'rejected', 'maybe']);
            $table->text('reason')->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_status_logs');
        Schema::dropIfExists('subscription_files');
        Schema::dropIfExists('subscription_time_slots');
        Schema::dropIfExists('subscription_company_details');
        Schema::dropIfExists('subscription_trainer_details');
        Schema::dropIfExists('subscription_trainee_details');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('package_ranges');
        Schema::dropIfExists('company_fields');
        Schema::dropIfExists('rounds');
        Schema::dropIfExists('stacks');
        Schema::dropIfExists('countries');
    }
};

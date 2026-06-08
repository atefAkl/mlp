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
        Schema::create('training_programs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('cover_image')->nullable();
            
            $table->string('training_type')->nullable(); // e.g., online, onsite, hybrid
            $table->string('project_type')->nullable(); 
            $table->json('tech_stack')->nullable();
            $table->string('methodology')->nullable();
            $table->string('level')->nullable(); // beginner, intermediate, advanced
            
            $table->integer('duration_weeks')->nullable();
            $table->integer('weekly_hours')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            
            $table->integer('capacity')->nullable();
            $table->integer('available_seats')->nullable();
            
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('discount_price', 10, 2)->nullable();
            
            $table->boolean('certificate_available')->default(false);
            $table->boolean('portfolio_available')->default(false);
            $table->boolean('admission_test_required')->default(false);
            $table->boolean('interview_required')->default(false);
            
            $table->string('status')->default('draft'); // draft, published, closed
            $table->timestamp('published_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_programs');
    }
};

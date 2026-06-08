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
        Schema::create('trainer_opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('description')->nullable();
            $table->string('specialization')->nullable();
            $table->string('employment_type')->nullable(); // full_time, part_time, freelance
            $table->string('experience_level')->nullable(); // junior, mid, senior
            $table->json('required_skills')->nullable();
            $table->string('location_type')->nullable(); // remote, onsite, hybrid
            $table->string('salary_range')->nullable();
            $table->integer('vacancies')->default(1);
            $table->date('application_deadline')->nullable();
            $table->string('status')->default('open'); // open, closed
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trainer_opportunities');
    }
};

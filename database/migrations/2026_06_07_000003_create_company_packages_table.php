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
        Schema::create('company_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->integer('duration_months')->default(1);
            $table->integer('max_trainers')->nullable();
            $table->integer('max_trainees')->nullable();
            $table->string('support_level')->nullable(); // basic, priority, dedicated
            $table->string('status')->default('active'); // active, inactive
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_packages');
    }
};

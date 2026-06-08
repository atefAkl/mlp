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
        Schema::table('training_programs', function (Blueprint $table) {
            $table->dropColumn(['tech_stack', 'requirements']);
        });

        Schema::table('trainer_opportunities', function (Blueprint $table) {
            $table->dropColumn('required_skills');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_programs', function (Blueprint $table) {
            $table->json('tech_stack')->nullable();
            $table->json('requirements')->nullable();
        });

        Schema::table('trainer_opportunities', function (Blueprint $table) {
            $table->json('required_skills')->nullable();
        });
    }
};

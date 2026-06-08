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
        Schema::create('positionables', function (Blueprint $table) {
            $table->foreignId('position_id')->constrained()->cascadeOnDelete();
            $table->morphs('positionable');
            $table->unique(['position_id', 'positionable_id', 'positionable_type'], 'positionables_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('positionables');
    }
};

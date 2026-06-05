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
        Schema::table('tasks', function (Blueprint $table) {
            $table->integer('points')->default(1)->after('type'); // Story points (1,3,5,8)
            $table->integer('revisions_count')->default(0)->after('points'); // How many times it was rejected
            $table->integer('rating')->nullable()->after('revisions_count'); // 1-5 star rating
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['points', 'revisions_count', 'rating']);
        });
    }
};

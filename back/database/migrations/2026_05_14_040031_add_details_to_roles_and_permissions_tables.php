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
        $tableNames = config('permission.table_names');

        Schema::table($tableNames['roles'], function (Blueprint $table) {
            if (!Schema::hasColumn($table->getTable(), 'description')) {
                $table->text('description')->nullable()->after('name');
            }
        });

        Schema::table($tableNames['permissions'], function (Blueprint $table) {
            if (!Schema::hasColumn($table->getTable(), 'description')) {
                $table->text('description')->nullable()->after('name');
            }
            if (!Schema::hasColumn($table->getTable(), 'group')) {
                // If there is an old 'category' column, we can rename it or just add 'group'
                if (Schema::hasColumn($table->getTable(), 'category')) {
                    $table->renameColumn('category', 'group');
                } else {
                    $table->string('group')->nullable()->after('description');
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableNames = config('permission.table_names');

        Schema::table($tableNames['roles'], function (Blueprint $table) {
            $table->dropColumn('description');
        });

        Schema::table($tableNames['permissions'], function (Blueprint $table) {
            $table->dropColumn(['description', 'group']);
        });
    }
};

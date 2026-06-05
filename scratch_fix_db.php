<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

echo "Checking permissions table...\n";
if (Schema::hasColumn('permissions', 'category')) {
    echo "Dropping category column...\n";
    Schema::table('permissions', function (Blueprint $table) {
        $table->dropColumn('category');
    });
}

if (!Schema::hasColumn('permissions', 'group')) {
    echo "Adding group column...\n";
    Schema::table('permissions', function (Blueprint $table) {
        $table->string('group')->nullable()->after('name');
    });
}

if (!Schema::hasColumn('permissions', 'description')) {
    echo "Adding description column...\n";
    Schema::table('permissions', function (Blueprint $table) {
        $table->text('description')->nullable()->after('name');
    });
}

if (!Schema::hasColumn('roles', 'description')) {
    echo "Adding description to roles...\n";
    Schema::table('roles', function (Blueprint $table) {
        $table->text('description')->nullable()->after('name');
    });
}

echo "Done!\n";

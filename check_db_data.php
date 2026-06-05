<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

try {
    echo "Users Count: " . User::count() . "\n";
    echo "Roles Count: " . Role::count() . "\n";
    echo "Permissions Count: " . Permission::count() . "\n";
    foreach(User::all() as $u) {
        echo "User ID: {$u->id}, Name: {$u->name}, Email: {$u->email}\n";
    }
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

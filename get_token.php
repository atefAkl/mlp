<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'admin@quest.com')->first();
if($user) {
    echo $user->createToken('swagger-test')->plainTextToken;
} else {
    echo "No user";
}

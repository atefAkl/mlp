<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['name' => 'يسرا', 'email' => 'yousra@quest.com'],
            ['name' => 'ربى', 'email' => 'roba@quest.com'],
            ['name' => 'سبأ', 'email' => 'saba@quest.com'],
            ['name' => 'عاطف', 'email' => 'atef@quest.com'],
            ['name' => 'هويدا', 'email' => 'howaida@quest.com'],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make('password'),
                ]
            );
        }
    }
}

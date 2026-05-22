<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'مدير التطبيق'], ['guard_name' => 'web']);

        $users = [
            [
                'name'      => 'يسرا زياد',
                'email'     => 'yousra@quest.com',
            ],
            [
                'name'      => 'ربى المحمود',
                'email'     => 'roba@quest.com',
            ],
            [
                'name'      => 'سبأ خضر',
                'email'     => 'saba@quest.com',
            ],
            [
                'name'      => 'عاطف عقل',
                'email'     => 'atef@quest.com',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name'      => $userData['name'],
                    'password'  => Hash::make('password'),
                    'is_active' => true,
                ]
            );
            // منح دور مدير التطبيق
            $user->syncRoles([$adminRole->name]);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Define Permissions with Groups and Descriptions
        $permissionGroups = [
            'صلاحيات المستخدمين' => [
                ['name' => 'view_users', 'description' => 'مشاهدة قائمة المستخدمين'],
                ['name' => 'create_users', 'description' => 'إضافة مستخدمين جدد للنظام'],
                ['name' => 'edit_users', 'description' => 'تعديل بيانات المستخدمين'],
                ['name' => 'delete_users', 'description' => 'حذف المستخدمين من النظام'],
                ['name' => 'toggle_user_status', 'description' => 'تنشيط أو إيقاف حسابات المستخدمين'],
            ],
            'صلاحيات الإعدادات' => [
                ['name' => 'manage_roles', 'description' => 'إدارة الأدوار وتعديل صلاحياتها'],
                ['name' => 'manage_permissions', 'description' => 'إدارة الصلاحيات الفردية'],
                ['name' => 'manage_settings', 'description' => 'تعديل إعدادات النظام العامة'],
            ],
            'صلاحيات المشروعات' => [
                ['name' => 'view_projects', 'description' => 'مشاهدة قائمة المشاريع'],
                ['name' => 'create_projects', 'description' => 'إنشاء مشاريع برمجية جديدة'],
                ['name' => 'edit_projects', 'description' => 'تعديل بيانات المشاريع'],
                ['name' => 'delete_projects', 'description' => 'حذف المشاريع'],
                ['name' => 'manage_backlog', 'description' => 'إدارة قائمة المهام المتأخرة (Backlog)'],
            ],
            'صلاحيات الجلسات' => [
                ['name' => 'view_sessions', 'description' => 'مشاهدة الجلسات التدريبية'],
                ['name' => 'create_sessions', 'description' => 'إنشاء جلسات توجيه جديدة'],
                ['name' => 'manage_attendance', 'description' => 'إدارة كشوف الحضور والغياب'],
            ],
            'صلاحيات المهام' => [
                ['name' => 'assign_tasks', 'description' => 'إسناد المهام للمتدربين'],
                ['name' => 'review_code', 'description' => 'مراجعة الكود البرمجي المقدم'],
                ['name' => 'submit_tasks', 'description' => 'رفع وتسليم المهام المنجزة'],
                ['name' => 'evaluate_work', 'description' => 'تقييم جودة العمل والنتائج'],
            ]
        ];

        foreach ($permissionGroups as $groupName => $perms) {
            foreach ($perms as $p) {
                Permission::updateOrCreate(
                    ['name' => $p['name']],
                    [
                        'guard_name' => 'web',
                        'description' => $p['description'],
                        'group' => $groupName
                    ]
                );
            }
        }

        // 2. Define Roles with Descriptions
        $rolesData = [
            'مدير التطبيق' => 'له كامل الصلاحيات في التحكم في كافة أجزاء النظام والإعدادات.',
            'مدير مشاريع' => 'مسؤول عن إدارة المشاريع، المتدربين، ومتابعة التقدم العام.',
            'موجه' => 'يقوم بمراجعة الكود، إسناد المهام التقنية، وتقييم أداء المتدربين.',
            'قائد فريق' => 'يدير فريقاً من المتدربين ويشرف على تسليم المهام اليومية.',
            'متدرب' => 'يستلم المهام، يرفع الكود، ويتابع سجل إنجازاته الشخصي.',
            'تيستر' => 'مسؤول عن فحص جودة البرمجيات وتسجيل الأخطاء والتحقق من إصلاحها.'
        ];

        foreach ($rolesData as $roleName => $description) {
            $role = Role::updateOrCreate(
                ['name' => $roleName],
                ['guard_name' => 'web', 'description' => $description]
            );

            // Simple Logic for auto-assigning permissions based on role
            if ($roleName === 'مدير التطبيق') {
                $role->syncPermissions(Permission::all());
            } elseif ($roleName === 'موجه') {
                $role->syncPermissions(Permission::whereIn('name', ['view_projects', 'assign_tasks', 'review_code', 'evaluate_work'])->get());
            } elseif ($roleName === 'متدرب') {
                $role->syncPermissions(Permission::whereIn('name', ['view_projects', 'view_sessions', 'submit_tasks'])->get());
            }
        }

        // Assign Role to Main Admin
        $admin = User::where('email', 'admin@quest.com')->first();
        if ($admin) {
            $admin->syncRoles(['مدير التطبيق']);
        }
    }
}

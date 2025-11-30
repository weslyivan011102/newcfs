<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Define roles
        $roles = [
            'admin' => [
                'manage all',
            ],
            'cashier' => [
                'moderator',
            ],
            'collector' => [
                'collection'
            ]
        ];

        foreach ($roles as $roleName => $permissions) {
            // Create or get role
            $role = Role::firstOrCreate(['name' => $roleName]);

            foreach ($permissions as $permissionName) {
                // Create or get permission
                $permission = Permission::firstOrCreate(['name' => $permissionName]);

                // Assign permission to role
                if (!$role->hasPermissionTo($permission)) {
                    $role->givePermissionTo($permission);
                }
            }
        }

        $this->command->info("✅ Roles and Permissions seeded successfully!");
    }
}

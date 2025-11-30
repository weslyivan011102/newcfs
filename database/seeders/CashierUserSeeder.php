<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class CashierUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Create the collector role if it doesn't exist
        $collectorRole = Role::firstOrCreate(['name' => 'cashier']);

        // Collectors data in array
        $collectors = [
            [
                'name' => 'cashier1',
                'email' => 'cashier1@gmail.com',
            ],
            [
                'name' => 'cashier2',
                'email' => 'cashier2@gmail.com',
            ],
            [
                'name' => 'cashier3',
                'email' => 'cashier3@gmail.com',
            ],
        ];

        foreach ($collectors as $collector) {
            $user = User::create([
                'name' => $collector['name'],
                'email' => $collector['email'],
                'password' => Hash::make('123123123'),
                'email_verified_at' => Carbon::now(),
            ]);

            // Assign collector role to each user
            $user->assignRole($collectorRole);
        }

        $this->command->info("✅ Cashier Users seeded successfully!");
    }
}

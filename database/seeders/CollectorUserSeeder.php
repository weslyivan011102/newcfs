<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class CollectorUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Create the collector role if it doesn't exist
        $collectorRole = Role::firstOrCreate(['name' => 'collector']);

        // Collectors data in array
        $collectors = [
            [
                'name' => 'collector1',
                'email' => 'collector1@gmail.com',
            ],
            [
                'name' => 'collector2',
                'email' => 'collector2@gmail.com',
            ],
            [
                'name' => 'collector3',
                'email' => 'collector3@gmail.com',
            ],
            [
                'name' => 'collector4',
                'email' => 'collector4@gmail.com',
            ],
            [
                'name' => 'collector5',
                'email' => 'collector5@gmail.com',
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

        $this->command->info("✅ Collector Users seeded successfully!");
    }
}

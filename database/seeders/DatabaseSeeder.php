<?php

namespace Database\Seeders;

use App\Models\Collector;
use App\Models\Customer;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Collector::factory()->count(10)->create();
        // Customer::factory(50)->create();

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('123123123'), // Ensure to hash the password
            'email_verified_at' => now(),
        ]);

        // $this->call([
        //     CollectorSeeder::class,
        //     CustomerSeeder::class,
        //     PlanSeeder::class,
        // ]);
    }
}

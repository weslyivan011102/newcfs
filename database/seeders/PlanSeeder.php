<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            ['mbps' => '30',  'plan_price' => '600'],
            ['mbps' => '50',  'plan_price' => '800'],
            ['mbps' => '100', 'plan_price' => '1000'],
            ['mbps' => '150', 'plan_price' => '1200'],
            ['mbps' => '200', 'plan_price' => '1500'],
            ['mbps' => '300', 'plan_price' => '2000'],
            ['mbps' => '400', 'plan_price' => '2500'],
        ];

        foreach ($plans as $plan) {
            Plan::create($plan);
        }
    }
}

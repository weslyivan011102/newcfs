<?php

namespace Database\Seeders;

use App\Models\Collector;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CollectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Collector::factory()->count(10)->create();
    }
}

<?php

namespace Database\Seeders;

use App\Models\Municipality;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $municipalities = [
            // ['municipality_name' => 'Delfin Albano'],
            // ['municipality_name' => 'Tumauini'],
            // ['municipality_name' => 'Cabagan'],

            ['municipality_name' => 'San Pablo'],
        ];

        foreach ($municipalities as $municipality) {
            Municipality::create($municipality);
        }
    }
}

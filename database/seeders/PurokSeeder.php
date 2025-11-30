<?php

namespace Database\Seeders;

use App\Models\Purok;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PurokSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $barangays = [
            1 => [ // Tumauini (municipality_id = 2)
                "purok1",
                "purok2",

            ],
            2 => [
                "purok3",
                "purok4",
            ],
        ];

        foreach ($barangays as $barangayId => $list) {
            foreach ($list as $barangayName) {
                Purok::create([
                    'purok_name' => $barangayName,
                    'barangay_id' => $barangayId,
                ]);
            }
        }
    }
}

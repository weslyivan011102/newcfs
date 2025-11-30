<?php

namespace Database\Seeders;

use App\Models\Barangay;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BarangaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $barangays = [
            // 2 => [ // Tumauini (municipality_id = 2)
            //     "ANNAFUNAN",
            //     "ANTAGAN I",
            //     "ANTAGAN II",
            //     "ARCON",
            //     "BALUG",
            //     "BANIG",
            //     "BANTUG",
            //     "BARANGAY DISTRICT 1 (POB.)",
            //     "BARANGAY DISTRICT 2 (POB.)",
            //     "BARANGAY DISTRICT 3 (POB.)",
            //     "BARANGAY DISTRICT 4 (POB.)",
            //     "BAYABO EAST",
            //     "CALIGAYAN",
            //     "CAMASI",
            //     "CARPENTERO",
            //     "COMPANIA",
            //     "CUMABAO",
            //     "FERMELDY (HCDA. SAN FRANCISCO)",
            //     "FUGU ABAJO",
            //     "FUGU NORTE",
            //     "FUGU SUR",
            //     "LALAUANAN",
            //     "LANNA",
            //     "LAPOGAN",
            //     "LINGALING",
            //     "LIWANAG",
            //     "MALAMAG EAST",
            //     "MALAMAG WEST",
            //     "MALIGAYA",
            //     "MINANGA",
            //     "MOLDERO",
            //     "NAMNAMA",
            //     "PARAGU",
            //     "PILITAN",
            //     "SAN MATEO",
            //     "SAN PEDRO",
            //     "SAN VICENTE",
            //     "SANTA",
            //     "SANTA CATALINA",
            //     "SANTA VISITACION (MAGGAYU)",
            //     "SANTO NIÑO",
            //     "SINIPPIL",
            //     "SISIM ABAJO",
            //     "SISIM ALTO",
            //     "TUNGGUI",
            //     "UGAD",
            // ],
            // 1 => [ // Delfin Albano (municipality_id = 1)
            //     "AGA",
            //     "ANDARAYAN",
            //     "ANEG",
            //     "BAYABO",
            //     "CALINAOAN SUR",
            //     "CALOOCAN",
            //     "CAPITOL",
            //     "CARMENCITA",
            //     "CONCEPCION",
            //     "MAUI",
            //     "QUIBAL",
            //     "RAGAN ALMACEN",
            //     "RAGAN NORTE",
            //     "RAGAN SUR (POB.)",
            //     "RIZAL (RAGAN ALMACEN ALTO)",
            //     "SAN ANDRES",
            //     "SAN ANTONIO",
            //     "SAN ISIDRO",
            //     "SAN JOSE",
            //     "SAN JUAN",
            //     "SAN MACARIO",
            //     "SAN NICOLAS (FUSI)",
            //     "SAN PATRICIO",
            //     "SAN ROQUE",
            //     "SANTO ROSARIO",
            //     "SANTOR",
            //     "VILLA LUZ",
            //     "VILLA PEREDA",
            //     "VISITACION",
            // ],
            // 3 => [
            //     "AGGUB",
            //     "ANAO",
            //     "ANGANCASILIAN",
            //     "BALASIG",
            //     "CANSAN",
            //     "CASIBARAG NORTE",
            //     "CASIBARAG SUR",
            //     "CATABAYUNGAN",
            //     "CENTRO (POB.)",
            //     "CUBAG",
            //     "GARITA",
            //     "LUQUILU",
            //     "MABANGUG",
            //     "MAGASSI",
            //     "MASIPI EAST",
            //     "MASIPI WEST",
            //     "NGARAG",
            //     "PILIG ABAJO",
            //     "PILIG ALTO",
            //     "SAN ANTONIO",
            //     "SAN BERNARDO",
            //     "SAN JUAN",
            //     "SAUI",
            //     "TALLAG",
            //     "UGAD",
            //     "UNION",
            // ],

            4 => [
                "ANNANUMAN",
                "AUITAN",
                "BALLACAYU",
                "BINGUANG",
                "BUNGAD",
                "CADDANGAN/LIMBAUAN",
                "CALAMAGUI",
                "CARALUCUD",
                "DALENA",
                "GUMINGA",
                "MINANGA NORTE",
                "MINANGA SUR",
                "POBLACION",
                "SAN JOSE",
                "SIMANU NORTE",
                "SIMANU SUR",
                "TUPA (SAN VICENTE)"
            ]
        ];

        foreach ($barangays as $municipalityId => $list) {
            foreach ($list as $barangayName) {
                Barangay::create([
                    'barangay_name' => $barangayName,
                    'municipality_id' => $municipalityId,
                ]);
            }
        }
    }
}

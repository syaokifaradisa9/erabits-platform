<?php

namespace Database\Seeders;

use App\Models\ItemChecklist;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItemChecklistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ItemChecklist::factory()->count(100)->create();
    }
}

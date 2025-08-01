<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Item::factory()->count(10)->create()->each(function ($item) {
            $item->checklists()->saveMany(
                \App\Models\ItemChecklist::factory()->count(rand(1, 5))->make()
            );
        });
    }
}

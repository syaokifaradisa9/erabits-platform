<?php

namespace Database\Factories;

use App\Models\ItemChecklist;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemChecklistFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ItemChecklist::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'item_id' => \App\Models\Item::factory(),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
        ];
    }
}

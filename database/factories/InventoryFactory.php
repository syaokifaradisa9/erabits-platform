<?php

namespace Database\Factories;

use App\Models\Inventory;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Inventory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'service_item_type_id' => \App\Models\ServiceItemType::factory(),
            'name' => $this->faker->word(),
            'image_path' => $this->faker->imageUrl(),
            'stock' => $this->faker->numberBetween(0, 100),
        ];
    }
}

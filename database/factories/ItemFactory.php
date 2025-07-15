<?php

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Item::class;

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
            'price' => $this->faker->numberBetween(10000, 1000000),
            'maintenance_count' => $this->faker->numberBetween(0, 10),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Consumable;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConsumableFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Consumable::class;

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
            'price' => $this->faker->numberBetween(1000, 100000),
            'type' => $this->faker->randomElement(['Pcs', 'Box']),
            'stock' => $this->faker->numberBetween(0, 100),
            'pcs_per_box' => $this->faker->numberBetween(1, 20),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\ServiceItemType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceItemTypeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ServiceItemType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'description' => $this->faker->sentence(),
            'icon' => $this->faker->word(),
            'is_active' => $this->faker->boolean(),
        ];
    }
}

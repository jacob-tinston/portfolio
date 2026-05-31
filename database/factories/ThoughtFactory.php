<?php

namespace Database\Factories;

use App\Models\Thought;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Thought>
 */
class ThoughtFactory extends Factory
{
    protected $model = Thought::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(rand(3, 8));

        return [
            'sort_order' => 0,
            'title' => rtrim($title, '.'),
            'thought_date' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'tags' => [fake()->word(), fake()->word()],
            'body_markdown' => implode("\n\n", fake()->paragraphs(2, false)),
            'is_published' => true,
        ];
    }
}

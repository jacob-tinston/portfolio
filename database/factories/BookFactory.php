<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    protected $model = Book::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sort_order' => 0,
            'title' => fake()->sentence(3),
            'author' => fake()->name(),
            'image_path' => '/images/headshot.png',
            'rating' => fake()->numberBetween(6, 10),
            'isbn' => null,
            'date_finished' => fake()->optional()->date(),
            'summary' => fake()->optional()->paragraph(),
            'notes' => '',
            'is_hidden' => false,
            'is_published' => true,
        ];
    }
}

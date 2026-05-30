<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sort_order' => 0,
            'is_published' => true,
            'is_featured' => false,
            'featured_order' => null,
            'title' => fake()->words(3, true),
            'description' => fake()->paragraphs(2, true),
            'image_path' => '/images/projects/copa.png',
            'tags' => ['Mobile', 'Laravel'],
            'website_url' => null,
            'app_store_url' => null,
            'play_store_url' => null,
        ];
    }
}

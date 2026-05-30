<?php

namespace Database\Factories;

use App\Models\NowPage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\NowPage>
 */
class NowPageFactory extends Factory
{
    protected $model = NowPage::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'building_markdown' => 'Building copy.',
            'learning_markdown' => 'Learning copy.',
            'reading_markdown' => 'Reading copy.',
        ];
    }
}

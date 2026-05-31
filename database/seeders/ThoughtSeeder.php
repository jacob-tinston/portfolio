<?php

namespace Database\Seeders;

use App\Models\Thought;
use Illuminate\Database\Seeder;

class ThoughtSeeder extends Seeder
{
    public function run(): void
    {
        Thought::query()->firstOrCreate(
            ['slug' => 'teaching-sand-to-think'],
            [
                'sort_order' => 0,
                'title' => 'Teaching Sand to Think',
                'thought_date' => '2026-03-01',
                'tags' => ['AI', 'Reflections'],
                'body_markdown' => "The universe doesn't know we're here and it likely won't notice when we're gone. And somewhere in that window we decided to spend our time teaching sand to think.",
                'is_published' => true,
            ],
        );
    }
}

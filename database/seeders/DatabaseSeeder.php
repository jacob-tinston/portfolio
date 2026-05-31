<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Jacob Tinston',
            'email' => 'jacob@tinston.dev',
        ]);

        $this->call(NowPageSeeder::class);
        $this->call(ProjectSeeder::class);
        $this->call(ThoughtSeeder::class);
    }
}

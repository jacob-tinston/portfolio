<?php

namespace Database\Seeders;

use App\Models\NowPage;
use Illuminate\Database\Seeder;

class NowPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        NowPage::content();
    }
}

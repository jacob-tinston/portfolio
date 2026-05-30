<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('now_pages', function (Blueprint $table) {
            $table->id();
            $table->longText('intro_markdown')->nullable();
            $table->longText('building_markdown')->nullable();
            $table->longText('learning_markdown')->nullable();
            $table->longText('reading_markdown')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('now_pages');
    }
};

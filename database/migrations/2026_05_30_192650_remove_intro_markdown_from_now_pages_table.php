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
        Schema::table('now_pages', function (Blueprint $table) {
            $table->dropColumn('intro_markdown');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('now_pages', function (Blueprint $table) {
            $table->longText('intro_markdown')->nullable()->after('id');
        });
    }
};

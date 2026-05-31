<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('thoughts')) {
            return;
        }

        if (! Schema::hasColumn('thoughts', 'date_display')) {
            return;
        }

        Schema::table('thoughts', function (Blueprint $table) {
            $table->date('thought_date')->nullable();
        });

        foreach (DB::table('thoughts')->select('id', 'date_display')->cursor() as $row) {
            $value = now()->toDateString();
            if (! empty($row->date_display)) {
                try {
                    $value = \Carbon\Carbon::parse($row->date_display)->toDateString();
                } catch (\Throwable) {
                    $value = now()->toDateString();
                }
            }

            DB::table('thoughts')->where('id', $row->id)->update(['thought_date' => $value]);
        }

        Schema::table('thoughts', function (Blueprint $table) {
            $table->dropColumn('date_display');
        });

        Schema::table('thoughts', function (Blueprint $table) {
            $table->date('thought_date')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('thoughts')) {
            return;
        }

        if (! Schema::hasColumn('thoughts', 'thought_date') || Schema::hasColumn('thoughts', 'date_display')) {
            return;
        }

        Schema::table('thoughts', function (Blueprint $table) {
            $table->string('date_display')->nullable();
        });

        foreach (DB::table('thoughts')->select('id', 'thought_date')->cursor() as $row) {
            $label = $row->thought_date
                ? \Carbon\Carbon::parse($row->thought_date)->format('F Y')
                : now()->format('F Y');

            DB::table('thoughts')->where('id', $row->id)->update(['date_display' => $label]);
        }

        Schema::table('thoughts', function (Blueprint $table) {
            $table->dropColumn('thought_date');
        });

        Schema::table('thoughts', function (Blueprint $table) {
            $table->string('date_display')->nullable(false)->change();
        });
    }
};

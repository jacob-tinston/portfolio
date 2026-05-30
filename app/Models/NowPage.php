<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NowPage extends Model
{
    /** @use HasFactory<\Database\Factories\NowPageFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'building_markdown',
        'learning_markdown',
        'reading_markdown',
    ];

    /**
     * Singleton row for the public /now page.
     */
    public static function content(): self
    {
        return static::query()->firstOrCreate(
            ['id' => 1],
            self::defaultAttributes(),
        );
    }

    /**
     * @return array<string, string>
     */
    public static function defaultAttributes(): array
    {
        return [
            'building_markdown' => '',
            'learning_markdown' => '',
            'reading_markdown' => '',
        ];
    }
}

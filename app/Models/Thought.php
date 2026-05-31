<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Thought extends Model
{
    /** @use HasFactory<\Database\Factories\ThoughtFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'sort_order',
        'title',
        'slug',
        'thought_date',
        'tags',
        'body_markdown',
        'is_published',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
            'thought_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Thought $thought): void {
            if ($thought->isDirty('title') || $thought->slug === null || $thought->slug === '') {
                $thought->slug = static::uniqueSlugFromTitle($thought->title, $thought->id);
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public static function uniqueSlugFromTitle(string $title, ?int $exceptId = null): string
    {
        $base = Str::slug($title);
        if ($base === '') {
            $base = 'thought';
        }

        $slug = $base;
        $suffix = 2;
        while (static::query()
            ->where('slug', $slug)
            ->when($exceptId !== null, fn ($query) => $query->where('id', '!=', $exceptId))
            ->exists()) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrderedForAdmin($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public function scopeOrderedForPublic($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Book extends Model
{
    /** @use HasFactory<\Database\Factories\BookFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'sort_order',
        'title',
        'slug',
        'author',
        'image_path',
        'rating',
        'isbn',
        'date_finished',
        'summary',
        'notes',
        'is_hidden',
        'is_published',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_hidden' => 'boolean',
            'is_published' => 'boolean',
            'date_finished' => 'date',
            'rating' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Book $book): void {
            if ($book->isDirty('title') || $book->slug === null || $book->slug === '') {
                $book->slug = static::uniqueSlugFromTitle($book->title, $book->id);
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
            $base = 'book';
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

    public function scopeVisible($query)
    {
        return $query->where('is_published', true)->where('is_hidden', false);
    }

    public function scopeOrderedForAdmin($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public function scopeOrderedForPublic($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public function getImagePublicUrlAttribute(): string
    {
        if ($this->image_path === null || $this->image_path === '') {
            return '';
        }

        if (str_starts_with($this->image_path, '/')) {
            return $this->image_path;
        }

        return Storage::disk('public')->url($this->image_path);
    }

    /**
     * @return array{slug: string, title: string, author: string, rating: int, date_finished: string|null, image: string}
     */
    public function toPublicTerminalProps(): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'author' => $this->author,
            'rating' => $this->rating,
            'date_finished' => $this->date_finished?->format('F j, Y'),
            'image' => $this->image_public_url,
        ];
    }
}

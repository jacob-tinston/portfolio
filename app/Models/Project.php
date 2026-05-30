<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'sort_order',
        'is_published',
        'is_featured',
        'featured_order',
        'title',
        'description',
        'image_path',
        'tags',
        'website_url',
        'app_store_url',
        'play_store_url',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'tags' => 'array',
            'featured_order' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrderedForPublic($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public function scopeFeaturedForHome($query)
    {
        return $query->published()
            ->where('is_featured', true)
            ->whereNotNull('featured_order')
            ->orderBy('featured_order');
    }

    /**
     * @return array{title: string, description: string, image: string, tags: array<int, string>, websiteUrl?: string, appStoreUrl?: string, playStoreUrl?: string}
     */
    public function toPublicProps(): array
    {
        $data = [
            'title' => $this->title,
            'description' => $this->description,
            'image' => $this->image_public_url,
            'tags' => $this->tags ?? [],
        ];

        if ($this->website_url) {
            $data['websiteUrl'] = $this->website_url;
        }
        if ($this->app_store_url) {
            $data['appStoreUrl'] = $this->app_store_url;
        }
        if ($this->play_store_url) {
            $data['playStoreUrl'] = $this->play_store_url;
        }

        return $data;
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
}

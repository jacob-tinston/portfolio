<?php

namespace App\Http\Requests\Content;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $isFeatured = $this->boolean('is_featured');
        $merge = [
            'is_published' => $this->boolean('is_published'),
            'is_featured' => $isFeatured,
            'featured_order' => $isFeatured ? $this->input('featured_order') : null,
        ];

        foreach (['website_url', 'app_store_url', 'play_store_url'] as $key) {
            if ($this->input($key) === '') {
                $merge[$key] = null;
            }
        }

        $this->merge($merge);
    }

    /**
     * @return array<string, array<int, \Illuminate\Contracts\Validation\ValidationRule|string>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:20000'],
            'image' => ['required', 'file', 'image', 'max:5120'],
            'tags' => ['nullable', 'string', 'max:2000'],
            'website_url' => ['nullable', 'string', 'max:2048', 'url'],
            'app_store_url' => ['nullable', 'string', 'max:2048', 'url'],
            'play_store_url' => ['nullable', 'string', 'max:2048', 'url'],
            'is_published' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'featured_order' => [
                Rule::excludeIf(! $this->boolean('is_featured')),
                'required',
                'integer',
                'min:1',
                'max:20',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Enter a project title.',
            'description.required' => 'Enter a description.',
            'image.required' => 'Choose a cover image.',
            'image.image' => 'The cover must be an image file.',
            'featured_order.required' => 'Enter a slider order when the project is featured on the home page.',
        ];
    }

    /**
     * @return array<int, string>
     */
    public function tagsList(): array
    {
        $raw = $this->string('tags')->trim()->toString();
        if ($raw === '') {
            return [];
        }

        return array_values(array_filter(array_map('trim', explode(',', $raw))));
    }
}

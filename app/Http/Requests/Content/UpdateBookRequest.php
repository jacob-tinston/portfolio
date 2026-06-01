<?php

namespace App\Http\Requests\Content;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $merge = [
            'is_hidden' => $this->boolean('is_hidden'),
            'is_published' => $this->boolean('is_published'),
        ];

        if ($this->input('isbn') === '') {
            $merge['isbn'] = null;
        }

        if ($this->input('date_finished') === '') {
            $merge['date_finished'] = null;
        }

        if ($this->input('summary') === '') {
            $merge['summary'] = null;
        }

        if ($this->input('notes') === '') {
            $merge['notes'] = null;
        }

        if ($this->input('current_page') === '') {
            $merge['current_page'] = null;
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
            'author' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'file', 'image', 'max:5120'],
            'rating' => ['required', 'integer', 'min:0', 'max:10'],
            'current_page' => ['nullable', 'integer', 'min:0'],
            'isbn' => ['nullable', 'string', 'max:32'],
            'date_finished' => ['nullable', 'date'],
            'summary' => ['nullable', 'string', 'max:20000'],
            'notes' => ['nullable', 'string', 'max:100000'],
            'is_hidden' => ['sometimes', 'boolean'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Enter the book title.',
            'author.required' => 'Enter the author name.',
            'image.image' => 'The cover must be an image file.',
            'rating.required' => 'Enter a rating from 0 to 10.',
        ];
    }
}

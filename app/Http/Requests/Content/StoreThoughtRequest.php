<?php

namespace App\Http\Requests\Content;

use Illuminate\Foundation\Http\FormRequest;

class StoreThoughtRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, \Illuminate\Contracts\Validation\ValidationRule|string>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'thought_date' => ['required', 'date'],
            'tags' => ['nullable', 'string', 'max:2000'],
            'body_markdown' => ['nullable', 'string', 'max:100000'],
            'is_published' => ['boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Enter a title.',
            'thought_date.required' => 'Choose a date.',
            'thought_date.date' => 'Choose a valid date.',
            'body_markdown.max' => 'Content is too long.',
        ];
    }
}

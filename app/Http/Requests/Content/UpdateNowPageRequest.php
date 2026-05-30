<?php

namespace App\Http\Requests\Content;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNowPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'building_markdown' => ['nullable', 'string', 'max:100000'],
            'learning_markdown' => ['nullable', 'string', 'max:100000'],
            'reading_markdown' => ['nullable', 'string', 'max:100000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'building_markdown.max' => 'Building content is too long.',
            'learning_markdown.max' => 'Learning content is too long.',
            'reading_markdown.max' => 'Reading content is too long.',
        ];
    }
}

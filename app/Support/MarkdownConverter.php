<?php

namespace App\Support;

use League\CommonMark\GithubFlavoredMarkdownConverter;

final class MarkdownConverter
{
    private static ?GithubFlavoredMarkdownConverter $converter = null;

    public static function toHtml(?string $markdown): string
    {
        if ($markdown === null || $markdown === '') {
            return '';
        }

        self::$converter ??= new GithubFlavoredMarkdownConverter([
            'html_input' => 'strip',
            'allow_unsafe_links' => false,
        ]);

        return self::$converter->convert($markdown)->getContent();
    }
}

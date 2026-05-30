<?php

namespace App\Http\Controllers;

use App\Models\NowPage;
use App\Support\MarkdownConverter;
use Inertia\Inertia;
use Inertia\Response;

class NowController extends Controller
{
    public function __invoke(): Response
    {
        $page = NowPage::content();

        return Inertia::render('now', [
            'buildingHtml' => MarkdownConverter::toHtml($page->building_markdown),
            'learningHtml' => MarkdownConverter::toHtml($page->learning_markdown),
            'readingHtml' => MarkdownConverter::toHtml($page->reading_markdown),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Thought;
use App\Support\MarkdownConverter;
use Inertia\Inertia;
use Inertia\Response;

class ThoughtsController extends Controller
{
    public function index(): Response
    {
        $thoughts = Thought::query()
            ->published()
            ->orderedForPublic()
            ->get()
            ->map(fn (Thought $thought) => [
                'slug' => $thought->slug,
                'title' => $thought->title,
                'date' => $thought->thought_date->format('F j, Y'),
            ])
            ->values()
            ->all();

        return Inertia::render('thoughts', [
            'thoughts' => $thoughts,
        ]);
    }

    public function show(Thought $thought): Response
    {
        abort_unless($thought->is_published, 404);

        return Inertia::render('thoughts/show', [
            'thought' => [
                'slug' => $thought->slug,
                'title' => $thought->title,
                'date' => $thought->thought_date->format('F j, Y'),
                'tags' => array_values($thought->tags ?? []),
                'body_html' => MarkdownConverter::toHtml($thought->body_markdown),
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Thought;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Return the XML sitemap.
     */
    public function __invoke(): Response
    {
        $routes = [
            ['url' => route('home'), 'priority' => '1.0', 'changefreq' => 'weekly'],
            ['url' => route('projects'), 'priority' => '0.9', 'changefreq' => 'monthly'],
            ['url' => route('books'), 'priority' => '0.85', 'changefreq' => 'monthly'],
            ['url' => route('now'), 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => route('thoughts'), 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => route('contact'), 'priority' => '0.7', 'changefreq' => 'yearly'],
        ];

        foreach (Thought::query()->published()->orderedForPublic()->get() as $thought) {
            $routes[] = [
                'url' => route('thoughts.show', $thought),
                'priority' => '0.65',
                'changefreq' => 'monthly',
            ];
        }

        $xml = view('sitemap', ['routes' => $routes])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}

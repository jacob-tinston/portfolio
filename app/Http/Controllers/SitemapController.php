<?php

namespace App\Http\Controllers;

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
            ['url' => route('now'), 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => route('contact'), 'priority' => '0.7', 'changefreq' => 'yearly'],
        ];

        $xml = view('sitemap', ['routes' => $routes])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}

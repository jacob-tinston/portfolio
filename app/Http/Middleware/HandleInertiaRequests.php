<?php

namespace App\Http\Middleware;

use App\Models\Book;
use App\Models\Project;
use App\Models\Thought;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'appUrl' => config('app.url'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'publicProjects' => Project::query()
                ->published()
                ->orderedForPublic()
                ->get()
                ->map(fn (Project $project) => $project->toPublicProps())
                ->values()
                ->all(),
            'publicBooks' => Book::query()
                ->visible()
                ->orderedForPublic()
                ->get()
                ->map(fn (Book $book) => $book->toPublicTerminalProps())
                ->values()
                ->all(),
            'latestThoughts' => Thought::query()
                ->published()
                ->orderedForPublic()
                ->limit(3)
                ->get()
                ->map(fn (Thought $thought) => [
                    'slug' => $thought->slug,
                    'title' => $thought->title,
                    'date' => $thought->thought_date->format('F j, Y'),
                ])
                ->values()
                ->all(),
        ];
    }
}

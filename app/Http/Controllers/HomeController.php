<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    private const HOME_BOOK_FAN_SLOTS = 5;

    public function __invoke(): Response
    {
        return Inertia::render('home', [
            'featuredProjects' => Project::query()
                ->featuredForHome()
                ->get()
                ->map(fn (Project $project) => $project->toPublicProps())
                ->values()
                ->all(),
            'homeBookFanItems' => $this->randomHomeBookFanItems(),
        ]);
    }

    /**
     * @return list<array{key: string, slug: string, title: string, author: string, rating: int, date_finished: string|null, image: string}>
     */
    private function randomHomeBookFanItems(): array
    {
        $selection = Book::query()
            ->visible()
            ->inRandomOrder()
            ->limit(self::HOME_BOOK_FAN_SLOTS)
            ->get();

        if ($selection->isEmpty()) {
            return [];
        }

        $count = $selection->count();
        $items = [];

        for ($i = 0; $i < self::HOME_BOOK_FAN_SLOTS; $i++) {
            $book = $selection->get($i % $count);
            $items[] = array_merge(
                $book->toPublicTerminalProps(),
                ['key' => $book->slug.'-'.$i],
            );
        }

        return $items;
    }
}

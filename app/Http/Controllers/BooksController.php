<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Support\MarkdownConverter;
use Inertia\Inertia;
use Inertia\Response;

class BooksController extends Controller
{
    public function index(): Response
    {
        $books = Book::query()
            ->visible()
            ->orderedForPublic()
            ->get()
            ->map(fn (Book $book) => $this->toListProps($book))
            ->values()
            ->all();

        return Inertia::render('books', [
            'books' => $books,
        ]);
    }

    public function show(Book $book): Response
    {
        abort_unless($book->is_published, 404);

        return Inertia::render('books/show', [
            'book' => $this->toShowProps($book),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function toListProps(Book $book): array
    {
        return [
            'id' => $book->id,
            'slug' => $book->slug,
            'title' => $book->title,
            'author' => $book->author,
            'rating' => $book->rating,
            'date_finished' => $book->date_finished?->format('F j, Y'),
            'summary' => $book->summary ?? '',
            'image' => $book->image_public_url,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function toShowProps(Book $book): array
    {
        return [
            'id' => $book->id,
            'slug' => $book->slug,
            'title' => $book->title,
            'author' => $book->author,
            'rating' => $book->rating,
            'isbn' => $book->isbn,
            'date_finished' => $book->date_finished?->format('F j, Y'),
            'summary' => $book->summary ?? '',
            'notes_html' => MarkdownConverter::toHtml($book->notes),
            'image' => $book->image_public_url,
            'is_hidden' => $book->is_hidden,
        ];
    }
}

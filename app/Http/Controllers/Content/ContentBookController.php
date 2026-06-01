<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Http\Requests\Content\ReorderBooksRequest;
use App\Http\Requests\Content\StoreBookRequest;
use App\Http\Requests\Content\UpdateBookRequest;
use App\Models\Book;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ContentBookController extends Controller
{
    public function index(): Response
    {
        $books = Book::query()
            ->orderedForAdmin()
            ->get()
            ->map(fn (Book $book) => [
                'id' => $book->id,
                'slug' => $book->slug,
                'title' => $book->title,
                'author' => $book->author,
                'sort_order' => $book->sort_order,
                'rating' => $book->rating,
                'is_hidden' => $book->is_hidden,
                'is_published' => $book->is_published,
                'image' => $book->image_public_url,
                'updated_at' => $book->updated_at?->toAtomString(),
            ])
            ->values()
            ->all();

        return Inertia::render('content/books/index', [
            'books' => $books,
            'status' => session('status'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('content/books/create', [
            'book' => null,
            'status' => session('status'),
        ]);
    }

    public function store(StoreBookRequest $request): RedirectResponse
    {
        $path = $request->file('image')->store('books', 'public');

        $nextSort = (int) Book::query()->max('sort_order') + 1;

        Book::query()->create([
            'sort_order' => $nextSort,
            'title' => $request->string('title')->toString(),
            'author' => $request->string('author')->toString(),
            'image_path' => $path,
            'rating' => (int) $request->input('rating'),
            'current_page' => $request->input('current_page') !== null ? (int) $request->input('current_page') : null,
            'isbn' => $request->input('isbn'),
            'date_finished' => $request->date('date_finished'),
            'summary' => $request->input('summary'),
            'notes' => $request->input('notes'),
            'is_hidden' => $request->boolean('is_hidden'),
            'is_published' => $request->boolean('is_published'),
        ]);

        return to_route('content.books')->with('status', 'book-created');
    }

    public function edit(Book $book): Response
    {
        return Inertia::render('content/books/edit', [
            'book' => [
                'id' => $book->id,
                'slug' => $book->slug,
                'title' => $book->title,
                'author' => $book->author,
                'rating' => $book->rating,
                'current_page' => $book->current_page,
                'isbn' => $book->isbn ?? '',
                'date_finished' => $book->date_finished?->format('Y-m-d') ?? '',
                'summary' => $book->summary ?? '',
                'notes' => $book->notes ?? '',
                'is_hidden' => $book->is_hidden,
                'is_published' => $book->is_published,
                'image' => $book->image_public_url,
                'updated_at' => $book->updated_at?->toAtomString(),
            ],
            'status' => session('status'),
        ]);
    }

    public function update(UpdateBookRequest $request, Book $book): RedirectResponse
    {
        $data = [
            'title' => $request->string('title')->toString(),
            'author' => $request->string('author')->toString(),
            'rating' => (int) $request->input('rating'),
            'current_page' => $request->input('current_page') !== null ? (int) $request->input('current_page') : null,
            'isbn' => $request->input('isbn'),
            'date_finished' => $request->date('date_finished'),
            'summary' => $request->input('summary'),
            'notes' => $request->input('notes'),
            'is_hidden' => $request->boolean('is_hidden'),
            'is_published' => $request->boolean('is_published'),
        ];

        if ($request->hasFile('image')) {
            $this->deleteStoredImageIfManaged($book);
            $data['image_path'] = $request->file('image')->store('books', 'public');
        }

        $book->update($data);

        return to_route('content.books.edit', $book)->with('status', 'book-updated');
    }

    public function destroy(Book $book): RedirectResponse
    {
        $this->deleteStoredImageIfManaged($book);
        $book->delete();

        return to_route('content.books')->with('status', 'book-deleted');
    }

    public function reorder(ReorderBooksRequest $request): RedirectResponse
    {
        /** @var array<int, int> $ids */
        $ids = $request->validated()['ids'];

        DB::transaction(function () use ($ids): void {
            foreach ($ids as $index => $id) {
                Book::query()->whereKey($id)->update(['sort_order' => $index]);
            }
        });

        return back();
    }

    private function deleteStoredImageIfManaged(Book $book): void
    {
        $path = $book->image_path;
        if ($path === null || $path === '' || str_starts_with($path, '/')) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}

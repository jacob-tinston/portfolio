<?php

use App\Models\Book;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('guests cannot manage books', function () {
    $book = Book::factory()->create();

    $this->get(route('content.books'))->assertRedirect(route('login'));
    $this->get(route('content.books.create'))->assertRedirect(route('login'));
    $this->post(route('content.books.store'), [])->assertRedirect(route('login'));
    $this->get(route('content.books.edit', $book))->assertRedirect(route('login'));
    $this->put(route('content.books.update', $book), [])->assertRedirect(route('login'));
    $this->delete(route('content.books.destroy', $book))->assertRedirect(route('login'));
    $this->patch(route('content.books.reorder'), ['ids' => [$book->id]])->assertRedirect(route('login'));
});

test('authenticated users can view the books admin index', function () {
    $user = User::factory()->create();
    Book::factory()->count(2)->create();

    $this->actingAs($user)
        ->get(route('content.books'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('content/books/index')->has('books'));
});

test('authenticated users can reorder books', function () {
    $user = User::factory()->create();
    $first = Book::factory()->create(['sort_order' => 0]);
    $second = Book::factory()->create(['sort_order' => 1]);

    $this->actingAs($user)
        ->patch(route('content.books.reorder'), [
            'ids' => [$second->id, $first->id],
        ])
        ->assertRedirect();

    expect(Book::query()->find($second->id)?->sort_order)->toBe(0)
        ->and(Book::query()->find($first->id)?->sort_order)->toBe(1);
});

test('authenticated users can create a book with an image', function () {
    $user = User::factory()->create();
    $image = UploadedFile::fake()->image('cover.png', 640, 480);

    $this->actingAs($user)
        ->post(route('content.books.store'), [
            'title' => 'Test book',
            'author' => 'Test Author',
            'image' => $image,
            'rating' => 8,
            'isbn' => '978-0-123456-78-9',
            'date_finished' => '2024-06-01',
            'summary' => 'A short summary.',
            'notes' => '## Notes',
            'is_hidden' => true,
            'is_published' => true,
        ])
        ->assertRedirect(route('content.books'));

    $book = Book::query()->where('title', 'Test book')->first();
    expect($book)->not->toBeNull()
        ->and($book->slug)->toBe('test-book')
        ->and($book->author)->toBe('Test Author')
        ->and($book->rating)->toBe(8)
        ->and($book->isbn)->toBe('978-0-123456-78-9')
        ->and($book->is_hidden)->toBeTrue()
        ->and($book->is_published)->toBeTrue()
        ->and($book->summary)->toBe('A short summary.')
        ->and($book->notes)->toBe('## Notes')
        ->and($book->image_path)->toBeString()->not->toStartWith('/');

    Storage::disk('public')->assertExists((string) $book->image_path);
});

test('authenticated users can delete a book', function () {
    $user = User::factory()->create();
    $book = Book::factory()->create([
        'image_path' => 'books/test.png',
    ]);
    Storage::disk('public')->put('books/test.png', 'fake');

    $this->actingAs($user)
        ->delete(route('content.books.destroy', $book))
        ->assertRedirect(route('content.books'));

    expect(Book::query()->find($book->id))->toBeNull();
    Storage::disk('public')->assertMissing('books/test.png');
});

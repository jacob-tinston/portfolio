<?php

use App\Models\Book;
use Inertia\Testing\AssertableInertia as Assert;

test('guests can view the public books index', function () {
    $this->get(route('books'))->assertOk()->assertInertia(
        fn (Assert $page) => $page->component('books')->has('books'),
    );
});

test('public books index only lists visible books', function () {
    Book::factory()->create(['title' => 'Visible Book', 'is_hidden' => false, 'is_published' => true, 'sort_order' => 0]);
    Book::factory()->create(['title' => 'Hidden Book', 'is_hidden' => true, 'is_published' => true, 'sort_order' => 1]);

    $this->get(route('books'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('books')
                ->has('books', 1)
                ->where('books.0.title', 'Visible Book'),
        );
});

test('public books index passes null finished date for books still being read', function () {
    Book::factory()->create([
        'title' => 'Still Reading',
        'is_hidden' => false,
        'is_published' => true,
        'date_finished' => null,
    ]);

    $this->get(route('books'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('books')
                ->has('books', 1)
                ->where('books.0.title', 'Still Reading')
                ->where('books.0.date_finished', null),
        );
});

test('guests can view a hidden book by direct url', function () {
    $book = Book::factory()->create([
        'title' => 'Secret Read',
        'is_hidden' => true,
        'is_published' => true,
    ]);

    $this->get(route('books.show', $book))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('books/show')
                ->where('book.title', 'Secret Read')
                ->where('book.is_hidden', true),
        );
});

test('guests can view a visible book show page', function () {
    $book = Book::factory()->create([
        'title' => 'Public Read',
        'is_hidden' => false,
        'is_published' => true,
        'notes' => 'Takeaway: **important**.',
    ]);

    expect($book->slug)->toBe('public-read');

    $this->get(route('books.show', $book))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('books/show')
                ->where('book.title', 'Public Read')
                ->has('book.notes_html'),
        );
});

test('unknown book slug returns not found', function () {
    $this->get('/books/does-not-exist-xyz')->assertNotFound();
});

test('draft books are not listed on the public index', function () {
    Book::factory()->create(['title' => 'Draft Only', 'is_published' => false, 'sort_order' => 0]);
    Book::factory()->create(['title' => 'Live One', 'is_published' => true, 'is_hidden' => false, 'sort_order' => 1]);

    $this->get(route('books'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('books')
                ->has('books', 1)
                ->where('books.0.title', 'Live One'),
        );
});

test('draft books are not accessible by direct url', function () {
    $book = Book::factory()->create([
        'title' => 'Unpublished',
        'is_published' => false,
    ]);

    $this->get(route('books.show', $book))->assertNotFound();
});

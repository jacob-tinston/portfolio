<?php

use App\Models\Book;
use Inertia\Testing\AssertableInertia as Assert;

test('home book fan is empty when there are no visible books', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('home')
                ->where('homeBookFanItems', []),
        );
});

test('home book fan pads to five slots by duplicating when fewer than five books exist', function () {
    Book::factory()->create([
        'title' => 'Only Book',
        'slug' => 'only-book',
        'is_hidden' => false,
        'is_published' => true,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('home')
                ->has('homeBookFanItems', 5)
                ->where('homeBookFanItems.0.slug', 'only-book')
                ->where('homeBookFanItems.1.slug', 'only-book')
                ->where('homeBookFanItems.2.slug', 'only-book')
                ->where('homeBookFanItems.3.slug', 'only-book')
                ->where('homeBookFanItems.4.slug', 'only-book')
                ->where('homeBookFanItems.0.key', 'only-book-0')
                ->where('homeBookFanItems.4.key', 'only-book-4'),
        );
});

test('home book fan exposes at most five random visible books when many exist', function () {
    Book::factory()->count(8)->create([
        'is_hidden' => false,
        'is_published' => true,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('home')
                ->has('homeBookFanItems', 5),
        );
});

<?php

use Inertia\Testing\AssertableInertia as Assert;

test('home page returns a successful response', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('featuredProjects')
            ->has('publicProjects')
            ->has('publicBooks')
            ->has('homeBookFanItems')
            ->has('latestThoughts'));
});

test('projects page returns a successful response', function () {
    $this->get(route('projects'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects')
            ->has('projects')
            ->has('publicProjects'));
});

test('books page returns a successful response', function () {
    $this->get(route('books'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('books')
            ->has('books')
            ->has('publicBooks'));
});

test('thoughts page returns a successful response', function () {
    $this->get(route('thoughts'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('thoughts')
            ->has('thoughts'));
});

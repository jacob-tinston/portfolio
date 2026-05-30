<?php

use Inertia\Testing\AssertableInertia as Assert;

test('home page returns a successful response', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('featuredProjects')
            ->has('publicProjects'));
});

test('projects page returns a successful response', function () {
    $this->get(route('projects'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects')
            ->has('projects')
            ->has('publicProjects'));
});

test('now page returns a successful response', function () {
    $response = $this->get(route('now'));

    $response->assertOk();
});

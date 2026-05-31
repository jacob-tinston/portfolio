<?php

use App\Models\Thought;
use Inertia\Testing\AssertableInertia as Assert;

test('guests can view published thoughts on the index', function () {
    Thought::factory()->create([
        'title' => 'Published One',
        'slug' => 'published-one',
        'thought_date' => '2026-05-01',
        'is_published' => true,
        'sort_order' => 0,
    ]);
    Thought::factory()->create([
        'title' => 'Draft One',
        'slug' => 'draft-one',
        'is_published' => false,
        'sort_order' => 1,
    ]);

    $this->get(route('thoughts'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('thoughts')
                ->has('thoughts', 1)
                ->where('thoughts.0.slug', 'published-one'),
        );
});

test('guests can view a published thought show page', function () {
    $thought = Thought::factory()->create([
        'title' => 'Deep Post',
        'slug' => 'deep-post',
        'thought_date' => '2026-04-15',
        'tags' => ['Ideas'],
        'body_markdown' => 'Some **markdown**.',
        'is_published' => true,
    ]);

    $this->get(route('thoughts.show', $thought))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('thoughts/show')
                ->where('thought.title', 'Deep Post')
                ->has('thought.body_html'),
        );
});

test('draft thoughts are not accessible on the public show route', function () {
    $thought = Thought::factory()->create(['is_published' => false]);

    $this->get(route('thoughts.show', $thought))->assertNotFound();
});

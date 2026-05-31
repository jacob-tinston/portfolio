<?php

use App\Models\Thought;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot manage thoughts in content', function () {
    $thought = Thought::factory()->create();

    $this->get(route('content.thoughts'))->assertRedirect(route('login'));
    $this->get(route('content.thoughts.create'))->assertRedirect(route('login'));
    $this->post(route('content.thoughts.store'), [])->assertRedirect(route('login'));
    $this->get(route('content.thoughts.edit', $thought))->assertRedirect(route('login'));
    $this->put(route('content.thoughts.update', $thought), [])->assertRedirect(route('login'));
    $this->delete(route('content.thoughts.destroy', $thought))->assertRedirect(route('login'));
    $this->patch(route('content.thoughts.reorder'), ['ids' => [$thought->id]])->assertRedirect(route('login'));
});

test('authenticated users can create and list thoughts', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('content.thoughts'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('content/thoughts/index')->has('thoughts', 0));

    $this->post(route('content.thoughts.store'), [
        'title' => 'Hello World',
        'thought_date' => '2026-06-15',
        'tags' => 'alpha, beta',
        'body_markdown' => 'Intro paragraph.',
        'is_published' => true,
    ])->assertRedirect(route('content.thoughts'));

    $this->get(route('content.thoughts'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('thoughts', 1)->where('thoughts.0.title', 'Hello World'));

    expect(Thought::query()->where('title', 'Hello World')->exists())->toBeTrue();
});

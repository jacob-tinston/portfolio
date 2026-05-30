<?php

use App\Models\User;

test('guests cannot visit the content hub', function () {
    $this->get(route('content'))->assertRedirect(route('login'));
});

test('authenticated users can visit the content hub', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('content'))->assertOk();
});

test('authenticated users can open content manage stubs', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('content.projects'))->assertOk()->assertInertia(
        fn ($page) => $page->component('content/projects/index'),
    );
    $this->get(route('content.books'))->assertOk();
    $this->get(route('content.now'))->assertOk();
});

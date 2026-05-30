<?php

use App\Models\NowPage;
use App\Models\User;

test('guests can view the public now page', function () {
    $this->get(route('now'))->assertOk();
});

test('guests cannot update now page content', function () {
    $this->put(route('content.now.update'), [
        'building_markdown' => 'b',
        'learning_markdown' => 'l',
        'reading_markdown' => 'r',
    ])->assertRedirect(route('login'));
});

test('authenticated users can update now page content', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    NowPage::content();

    $this->put(route('content.now.update'), [
        'building_markdown' => 'Building **bold**.',
        'learning_markdown' => '',
        'reading_markdown' => '',
    ])->assertRedirect(route('content.now'));

    $page = NowPage::content()->fresh();
    expect($page->building_markdown)->toBe('Building **bold**.')
        ->and($page->learning_markdown)->toBeNull()
        ->and($page->reading_markdown)->toBeNull();
});

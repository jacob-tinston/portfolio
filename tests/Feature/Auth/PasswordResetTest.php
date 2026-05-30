<?php

use App\Models\User;
use Illuminate\Support\Facades\Notification;

test('forgot password is disabled', function () {
    $this->get('/forgot-password')->assertNotFound();
});

test('password reset email cannot be requested', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->post('/forgot-password', ['email' => $user->email])->assertNotFound();

    Notification::assertNothingSent();
});

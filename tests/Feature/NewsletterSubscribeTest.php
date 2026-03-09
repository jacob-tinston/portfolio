<?php

use Illuminate\Support\Facades\Config;

test('newsletter subscribe requires email', function () {
    Config::set('services.resend.key', 're_fake_key');

    $response = $this->postJson(route('newsletter.subscribe'), []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['email']);
});

test('newsletter subscribe requires valid email', function () {
    Config::set('services.resend.key', 're_fake_key');

    $response = $this->postJson(route('newsletter.subscribe'), [
        'email' => 'not-an-email',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['email']);
});

test('newsletter subscribe returns 503 when resend is not configured', function () {
    Config::set('services.resend.key', '');

    $response = $this->postJson(route('newsletter.subscribe'), [
        'email' => 'user@example.com',
    ]);

    $response->assertStatus(503);
    $response->assertJson(['message' => 'Newsletter signup is not configured.']);
});

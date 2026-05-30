<?php

test('registration is disabled', function () {
    $this->get('/register')->assertNotFound();
});

test('registration cannot be submitted', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertNotFound();
});

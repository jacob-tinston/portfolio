<?php

test('home page returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});

test('projects page returns a successful response', function () {
    $response = $this->get(route('projects'));

    $response->assertOk();
});

test('now page returns a successful response', function () {
    $response = $this->get(route('now'));

    $response->assertOk();
});
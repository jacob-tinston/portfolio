<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'home')->name('home');
Route::inertia('/projects', 'projects')->name('projects');
Route::inertia('/now', 'now')->name('now');
Route::inertia('/contact', 'contact')->name('contact');
Route::inertia('/thoughts', 'thoughts')->name('thoughts');
Route::get('/thoughts/{slug}', fn (string $slug) => inertia('thoughts/show', ['slug' => $slug]))->name('thoughts.show');

Route::get('/sitemap.xml', App\Http\Controllers\SitemapController::class)->name('sitemap');
Route::get('/robots.txt', fn () => response(
    "User-agent: *\nDisallow:\n\nSitemap: ".route('sitemap'),
    200,
)->header('Content-Type', 'text/plain'));
Route::post('/newsletter', App\Http\Controllers\NewsletterSubscribeController::class)->name('newsletter.subscribe');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

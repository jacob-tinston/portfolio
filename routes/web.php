<?php

use App\Http\Controllers\Content\ContentProjectController;
use App\Http\Controllers\Content\NowPageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NowController;
use App\Http\Controllers\ProjectsController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/projects', ProjectsController::class)->name('projects');
Route::get('/now', NowController::class)->name('now');
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
    Route::inertia('content', 'content')->name('content');
    Route::get('content/projects', [ContentProjectController::class, 'index'])->name('content.projects');
    Route::get('content/projects/create', [ContentProjectController::class, 'create'])->name('content.projects.create');
    Route::post('content/projects', [ContentProjectController::class, 'store'])->name('content.projects.store');
    Route::get('content/projects/{project}/edit', [ContentProjectController::class, 'edit'])->name('content.projects.edit');
    Route::put('content/projects/{project}', [ContentProjectController::class, 'update'])->name('content.projects.update');
    Route::delete('content/projects/{project}', [ContentProjectController::class, 'destroy'])->name('content.projects.destroy');
    Route::patch('content/projects/reorder', [ContentProjectController::class, 'reorder'])->name('content.projects.reorder');
    Route::inertia('content/books', 'content/books')->name('content.books');
    Route::get('content/now', [NowPageController::class, 'edit'])->name('content.now');
    Route::put('content/now', [NowPageController::class, 'update'])->name('content.now.update');
});

require __DIR__.'/settings.php';

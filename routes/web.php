<?php

use App\Http\Controllers\BooksController;
use App\Http\Controllers\Content\ContentBookController;
use App\Http\Controllers\Content\ContentProjectController;
use App\Http\Controllers\Content\ContentThoughtController;
use App\Http\Controllers\Content\NowPageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NowController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\ThoughtsController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/projects', ProjectsController::class)->name('projects');
Route::get('/books', [BooksController::class, 'index'])->name('books');
Route::get('/books/{book}', [BooksController::class, 'show'])->name('books.show');
Route::get('/now', NowController::class)->name('now');
Route::inertia('/contact', 'contact')->name('contact');
Route::get('/thoughts', [ThoughtsController::class, 'index'])->name('thoughts');
Route::get('/thoughts/{thought}', [ThoughtsController::class, 'show'])->name('thoughts.show');

Route::get('/sitemap.xml', App\Http\Controllers\SitemapController::class)->name('sitemap');
Route::get('/robots.txt', fn () => response(
    "User-agent: *\nDisallow:\n\nSitemap: ".route('sitemap'),
    200,
)->header('Content-Type', 'text/plain'));
Route::post('/newsletter', App\Http\Controllers\NewsletterSubscribeController::class)->name('newsletter.subscribe');

Route::redirect('/admin', '/dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/content')->name('dashboard');
    Route::inertia('content', 'content')->name('content');
    Route::get('content/projects', [ContentProjectController::class, 'index'])->name('content.projects');
    Route::get('content/projects/create', [ContentProjectController::class, 'create'])->name('content.projects.create');
    Route::post('content/projects', [ContentProjectController::class, 'store'])->name('content.projects.store');
    Route::get('content/projects/{project}/edit', [ContentProjectController::class, 'edit'])->name('content.projects.edit');
    Route::put('content/projects/{project}', [ContentProjectController::class, 'update'])->name('content.projects.update');
    Route::delete('content/projects/{project}', [ContentProjectController::class, 'destroy'])->name('content.projects.destroy');
    Route::patch('content/projects/reorder', [ContentProjectController::class, 'reorder'])->name('content.projects.reorder');
    Route::get('content/books', [ContentBookController::class, 'index'])->name('content.books');
    Route::get('content/books/create', [ContentBookController::class, 'create'])->name('content.books.create');
    Route::post('content/books', [ContentBookController::class, 'store'])->name('content.books.store');
    Route::get('content/books/{book}/edit', [ContentBookController::class, 'edit'])->name('content.books.edit');
    Route::put('content/books/{book}', [ContentBookController::class, 'update'])->name('content.books.update');
    Route::delete('content/books/{book}', [ContentBookController::class, 'destroy'])->name('content.books.destroy');
    Route::patch('content/books/reorder', [ContentBookController::class, 'reorder'])->name('content.books.reorder');
    Route::get('content/thoughts', [ContentThoughtController::class, 'index'])->name('content.thoughts');
    Route::get('content/thoughts/create', [ContentThoughtController::class, 'create'])->name('content.thoughts.create');
    Route::post('content/thoughts', [ContentThoughtController::class, 'store'])->name('content.thoughts.store');
    Route::get('content/thoughts/{thought}/edit', [ContentThoughtController::class, 'edit'])->name('content.thoughts.edit');
    Route::put('content/thoughts/{thought}', [ContentThoughtController::class, 'update'])->name('content.thoughts.update');
    Route::delete('content/thoughts/{thought}', [ContentThoughtController::class, 'destroy'])->name('content.thoughts.destroy');
    Route::patch('content/thoughts/reorder', [ContentThoughtController::class, 'reorder'])->name('content.thoughts.reorder');
    Route::get('content/now', [NowPageController::class, 'edit'])->name('content.now');
    Route::put('content/now', [NowPageController::class, 'update'])->name('content.now.update');
});

require __DIR__.'/settings.php';

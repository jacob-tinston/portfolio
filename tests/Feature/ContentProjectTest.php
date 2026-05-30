<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('guests cannot manage projects', function () {
    $project = Project::factory()->create();

    $this->get(route('content.projects'))->assertRedirect(route('login'));
    $this->get(route('content.projects.create'))->assertRedirect(route('login'));
    $this->post(route('content.projects.store'), [])->assertRedirect(route('login'));
    $this->get(route('content.projects.edit', $project))->assertRedirect(route('login'));
    $this->put(route('content.projects.update', $project), [])->assertRedirect(route('login'));
    $this->delete(route('content.projects.destroy', $project))->assertRedirect(route('login'));
    $this->patch(route('content.projects.reorder'), ['ids' => [$project->id]])->assertRedirect(route('login'));
});

test('authenticated users can view the projects admin index', function () {
    $user = User::factory()->create();
    Project::factory()->count(2)->create();

    $this->actingAs($user)
        ->get(route('content.projects'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('content/projects/index')->has('projects'));
});

test('authenticated users can reorder projects', function () {
    $user = User::factory()->create();
    $first = Project::factory()->create(['sort_order' => 0]);
    $second = Project::factory()->create(['sort_order' => 1]);

    $this->actingAs($user)
        ->patch(route('content.projects.reorder'), [
            'ids' => [$second->id, $first->id],
        ])
        ->assertRedirect();

    expect(Project::query()->find($second->id)?->sort_order)->toBe(0)
        ->and(Project::query()->find($first->id)?->sort_order)->toBe(1);
});

test('authenticated users can create a project with an image', function () {
    $user = User::factory()->create();
    $image = UploadedFile::fake()->image('cover.png', 640, 480);

    $this->actingAs($user)
        ->post(route('content.projects.store'), [
            'title' => 'Test project',
            'description' => 'A short description for the test project.',
            'image' => $image,
            'tags' => 'One, Two',
            'website_url' => 'https://example.com',
            'is_published' => true,
            'is_featured' => true,
            'featured_order' => '2',
        ])
        ->assertRedirect(route('content.projects'));

    $project = Project::query()->where('title', 'Test project')->first();
    expect($project)->not->toBeNull()
        ->and($project->is_published)->toBeTrue()
        ->and($project->is_featured)->toBeTrue()
        ->and($project->tags)->toBe(['One', 'Two'])
        ->and($project->featured_order)->toBe(2)
        ->and($project->website_url)->toBe('https://example.com')
        ->and($project->image_path)->toBeString()->not->toStartWith('/');

    Storage::disk('public')->assertExists((string) $project->image_path);
});

test('home slider scope only includes featured projects with an order', function () {
    $on = Project::factory()->create([
        'is_published' => true,
        'is_featured' => true,
        'featured_order' => 1,
    ]);
    $off = Project::factory()->create([
        'is_published' => true,
        'is_featured' => false,
        'featured_order' => 2,
    ]);

    $ids = Project::query()->featuredForHome()->pluck('id')->all();

    expect($ids)->toContain($on->id)->not->toContain($off->id);
});

test('authenticated users can delete a project', function () {
    $user = User::factory()->create();
    $project = Project::factory()->create([
        'image_path' => 'projects/test.png',
    ]);
    Storage::disk('public')->put('projects/test.png', 'fake');

    $this->actingAs($user)
        ->delete(route('content.projects.destroy', $project))
        ->assertRedirect(route('content.projects'));

    expect(Project::query()->find($project->id))->toBeNull();
    Storage::disk('public')->assertMissing('projects/test.png');
});

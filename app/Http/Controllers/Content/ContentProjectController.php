<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Http\Requests\Content\ReorderProjectsRequest;
use App\Http\Requests\Content\StoreProjectRequest;
use App\Http\Requests\Content\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ContentProjectController extends Controller
{
    public function index(): Response
    {
        $projects = Project::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (Project $project) => [
                'id' => $project->id,
                'title' => $project->title,
                'sort_order' => $project->sort_order,
                'is_published' => $project->is_published,
                'is_featured' => $project->is_featured,
                'featured_order' => $project->featured_order,
                'image' => $project->image_public_url,
                'updated_at' => $project->updated_at?->toAtomString(),
            ])
            ->values()
            ->all();

        return Inertia::render('content/projects/index', [
            'projects' => $projects,
            'status' => session('status'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('content/projects/create', [
            'project' => null,
            'status' => session('status'),
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $path = $request->file('image')->store('projects', 'public');

        $nextSort = (int) Project::query()->max('sort_order') + 1;

        Project::query()->create([
            'sort_order' => $nextSort,
            'is_published' => $request->boolean('is_published'),
            'is_featured' => $request->boolean('is_featured'),
            'featured_order' => $request->boolean('is_featured')
                ? $this->normalizedFeaturedOrder($request->input('featured_order'))
                : null,
            'title' => $request->string('title')->toString(),
            'description' => $request->string('description')->toString(),
            'image_path' => $path,
            'tags' => $request->tagsList(),
            'website_url' => $request->input('website_url'),
            'app_store_url' => $request->input('app_store_url'),
            'play_store_url' => $request->input('play_store_url'),
        ]);

        return to_route('content.projects')->with('status', 'project-created');
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('content/projects/edit', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'description' => $project->description,
                'tags' => implode(', ', $project->tags ?? []),
                'website_url' => $project->website_url ?? '',
                'app_store_url' => $project->app_store_url ?? '',
                'play_store_url' => $project->play_store_url ?? '',
                'is_published' => $project->is_published,
                'is_featured' => $project->is_featured,
                'featured_order' => $project->featured_order,
                'image' => $project->image_public_url,
                'updated_at' => $project->updated_at?->toAtomString(),
            ],
            'status' => session('status'),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $data = [
            'is_published' => $request->boolean('is_published'),
            'is_featured' => $request->boolean('is_featured'),
            'featured_order' => $request->boolean('is_featured')
                ? $this->normalizedFeaturedOrder($request->input('featured_order'))
                : null,
            'title' => $request->string('title')->toString(),
            'description' => $request->string('description')->toString(),
            'tags' => $request->tagsList(),
            'website_url' => $request->input('website_url'),
            'app_store_url' => $request->input('app_store_url'),
            'play_store_url' => $request->input('play_store_url'),
        ];

        if ($request->hasFile('image')) {
            $this->deleteStoredImageIfManaged($project);
            $data['image_path'] = $request->file('image')->store('projects', 'public');
        }

        $project->update($data);

        return to_route('content.projects.edit', $project)->with('status', 'project-updated');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->deleteStoredImageIfManaged($project);
        $project->delete();

        return to_route('content.projects')->with('status', 'project-deleted');
    }

    public function reorder(ReorderProjectsRequest $request): RedirectResponse
    {
        /** @var array<int, int> $ids */
        $ids = $request->validated()['ids'];

        DB::transaction(function () use ($ids): void {
            foreach ($ids as $index => $id) {
                Project::query()->whereKey($id)->update(['sort_order' => $index]);
            }
        });

        return back();
    }

    private function normalizedFeaturedOrder(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) $value;
    }

    private function deleteStoredImageIfManaged(Project $project): void
    {
        $path = $project->image_path;
        if ($path === null || $path === '' || str_starts_with($path, '/')) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}

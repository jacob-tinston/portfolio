<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Http\Requests\Content\ReorderThoughtsRequest;
use App\Http\Requests\Content\StoreThoughtRequest;
use App\Http\Requests\Content\UpdateThoughtRequest;
use App\Models\Thought;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ContentThoughtController extends Controller
{
    public function index(): Response
    {
        $thoughts = Thought::query()
            ->orderedForAdmin()
            ->get()
            ->map(fn (Thought $thought) => [
                'id' => $thought->id,
                'slug' => $thought->slug,
                'title' => $thought->title,
                'date_display' => $thought->thought_date->format('F j, Y'),
                'sort_order' => $thought->sort_order,
                'is_published' => $thought->is_published,
                'updated_at' => $thought->updated_at?->toAtomString(),
            ])
            ->values()
            ->all();

        return Inertia::render('content/thoughts/index', [
            'thoughts' => $thoughts,
            'status' => session('status'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('content/thoughts/create', [
            'status' => session('status'),
        ]);
    }

    public function store(StoreThoughtRequest $request): RedirectResponse
    {
        $nextSort = (int) Thought::query()->max('sort_order') + 1;

        Thought::query()->create([
            'sort_order' => $nextSort,
            'title' => $request->string('title')->toString(),
            'thought_date' => $request->date('thought_date'),
            'tags' => $this->parseCommaTags($request->string('tags')->toString()),
            'body_markdown' => $request->input('body_markdown'),
            'is_published' => $request->boolean('is_published'),
        ]);

        return to_route('content.thoughts')->with('status', 'thought-created');
    }

    public function edit(Thought $thought): Response
    {
        return Inertia::render('content/thoughts/edit', [
            'thought' => [
                'id' => $thought->id,
                'slug' => $thought->slug,
                'title' => $thought->title,
                'thought_date' => $thought->thought_date->toDateString(),
                'tags' => $this->formatTagsForInput($thought->tags),
                'body_markdown' => (string) ($thought->body_markdown ?? ''),
                'is_published' => $thought->is_published,
                'updated_at' => $thought->updated_at?->toAtomString(),
            ],
            'status' => session('status'),
        ]);
    }

    public function update(UpdateThoughtRequest $request, Thought $thought): RedirectResponse
    {
        $thought->update([
            'title' => $request->string('title')->toString(),
            'thought_date' => $request->date('thought_date'),
            'tags' => $this->parseCommaTags($request->string('tags')->toString()),
            'body_markdown' => $request->input('body_markdown'),
            'is_published' => $request->boolean('is_published'),
        ]);

        return to_route('content.thoughts.edit', $thought)->with('status', 'thought-updated');
    }

    public function destroy(Thought $thought): RedirectResponse
    {
        $thought->delete();

        return to_route('content.thoughts')->with('status', 'thought-deleted');
    }

    public function reorder(ReorderThoughtsRequest $request): RedirectResponse
    {
        /** @var array<int, int> $ids */
        $ids = $request->validated()['ids'];

        DB::transaction(function () use ($ids): void {
            foreach ($ids as $index => $id) {
                Thought::query()->whereKey($id)->update(['sort_order' => $index]);
            }
        });

        return back();
    }

    /**
     * @return list<string>|null
     */
    private function parseCommaTags(string $raw): ?array
    {
        $parts = array_values(array_filter(array_map('trim', explode(',', $raw))));

        if ($parts === []) {
            return null;
        }

        return $parts;
    }

    /**
     * @param  list<string>|null  $tags
     */
    private function formatTagsForInput(?array $tags): string
    {
        if ($tags === null || $tags === []) {
            return '';
        }

        return implode(', ', $tags);
    }
}

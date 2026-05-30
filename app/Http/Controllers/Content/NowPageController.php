<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Http\Requests\Content\UpdateNowPageRequest;
use App\Models\NowPage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NowPageController extends Controller
{
    public function edit(): Response
    {
        $page = NowPage::content();

        return Inertia::render('content/now', [
            'buildingMarkdown' => (string) ($page->building_markdown ?? ''),
            'learningMarkdown' => (string) ($page->learning_markdown ?? ''),
            'readingMarkdown' => (string) ($page->reading_markdown ?? ''),
            'updatedAt' => $page->updated_at?->toAtomString(),
            'status' => session('status'),
        ]);
    }

    public function update(UpdateNowPageRequest $request): RedirectResponse
    {
        $page = NowPage::content();
        $page->fill($request->validated());
        $page->save();

        return to_route('content.now')->with('status', 'now-updated');
    }
}

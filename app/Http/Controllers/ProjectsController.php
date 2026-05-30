<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class ProjectsController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('projects', [
            'projects' => Project::query()
                ->published()
                ->orderedForPublic()
                ->get()
                ->map(fn (Project $project) => $project->toPublicProps())
                ->values()
                ->all(),
        ]);
    }
}

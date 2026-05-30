<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('home', [
            'featuredProjects' => Project::query()
                ->featuredForHome()
                ->get()
                ->map(fn (Project $project) => $project->toPublicProps())
                ->values()
                ->all(),
        ]);
    }
}

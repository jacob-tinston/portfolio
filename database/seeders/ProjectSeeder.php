<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $definitions = [
            [
                'title' => 'Roger That',
                'description' => "A daily pop-culture guessing game. You're shown four celebrities and have to figure out which person has been romantically linked to all of them. Scheduled AI agents research the connections, verify them with citations, generate caricature images, and publish each game automatically.",
                'image_path' => '/images/projects/rogerthat.png',
                'tags' => ['AI', 'LangChain', 'Laravel'],
                'website_url' => 'https://playrogerthat.com?ref=portfolio',
                'app_store_url' => null,
                'play_store_url' => null,
                'featured_order' => 3,
                'is_featured' => true,
            ],
            [
                'title' => 'HomeHub',
                'description' => 'HomeHub is a platform that sits between landlords and tenants. Tenants can report repairs, track energy usage, get advice on cutting bills, and access plain-English guides on how their home works. Landlords get a single place to communicate with hundreds of tenants and reduce the back-and-forth.',
                'image_path' => '/images/projects/homehub.png',
                'tags' => ['Mobile', 'Flutter'],
                'website_url' => null,
                'app_store_url' => 'https://apps.apple.com/gb/app/homehub-info/id6752408814',
                'play_store_url' => 'https://play.google.com/store/apps/details?id=uk.co.homehubinfo&hl=en',
                'featured_order' => 4,
                'is_featured' => true,
            ],
            [
                'title' => 'TaperedView',
                'description' => 'An augmented reality tool that lets surveyors scan a flat roof with their phone or tablet and get accurate measurements instantly. It uses LiDAR to plot key points, then automatically converts the data into technical blueprints. Around ten times faster than measuring by hand and removes human error.',
                'image_path' => '/images/projects/taperedplus.png',
                'tags' => ['Mobile', 'AR', 'Swift'],
                'website_url' => null,
                'app_store_url' => null,
                'play_store_url' => null,
                'featured_order' => 2,
                'is_featured' => true,
            ],
            [
                'title' => 'COPA',
                'description' => 'COPA is a mobile app that gives people across Teesside a way to report crime, antisocial behaviour and community concerns directly to Cleveland Police and the Police and Crime Commissioner. It was the first app of its kind in the UK, picked up over 7,500 downloads, and has contributed to successful prosecutions.',
                'image_path' => '/images/projects/copa.png',
                'tags' => ['Mobile', 'React Native', 'C#'],
                'website_url' => null,
                'app_store_url' => 'https://apps.apple.com/gb/app/copa/id1638356129',
                'play_store_url' => 'https://play.google.com/store/apps/details?id=com.clevelandpcc.reporting&hl=en',
                'featured_order' => 1,
                'is_featured' => true,
            ],
            [
                'title' => 'Cwtsh',
                'description' => 'Cwtsh is an internal rewards app built for Transport for Wales. Staff recognise each other by sending digital coins that can be redeemed for gift vouchers, and the app doubles as an internal news and social platform with gamification built in. Over 2,500 employees downloaded it in its first year.',
                'image_path' => '/images/projects/cwtsh.png',
                'tags' => ['Mobile', 'React Native', 'C#'],
                'website_url' => null,
                'app_store_url' => null,
                'play_store_url' => null,
                'featured_order' => null,
                'is_featured' => false,
            ],
        ];

        foreach ($definitions as $index => $def) {
            Project::query()->updateOrCreate(
                ['title' => $def['title']],
                [
                    'sort_order' => $index * 10,
                    'is_published' => true,
                    'is_featured' => $def['is_featured'] ?? false,
                    'featured_order' => $def['featured_order'],
                    'description' => $def['description'],
                    'image_path' => $def['image_path'],
                    'tags' => $def['tags'],
                    'website_url' => $def['website_url'],
                    'app_store_url' => $def['app_store_url'],
                    'play_store_url' => $def['play_store_url'],
                ],
            );
        }
    }
}

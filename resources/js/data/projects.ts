export type Project = {
    title: string;
    description: string;
    image: string;
    tags: string[];
    websiteUrl?: string;
    appStoreUrl?: string;
    playStoreUrl?: string;
};

export const PROJECTS_INTRO =
    "A small collection of work and personal projects I've put together over the years.";
export const PROJECTS_ARCHIVE_INTRO =
    'Have a look at my full projects archive and case studies.';

export const projects: Project[] = [
    {
        title: 'Roger That',
        description:
            "A daily pop-culture guessing game. You're shown four celebrities and have to figure out which person has been romantically linked to all of them. Scheduled AI agents research the connections, verify them with citations, generate caricature images, and publish each game automatically.",
        image: '/images/projects/rogerthat.png',
        tags: ['AI', 'LangChain', 'Laravel'],
        websiteUrl: 'https://playrogerthat.com?ref=portfolio',
    },
    {
        title: 'HomeHub',
        description:
            "HomeHub is a platform that sits between landlords and tenants. Tenants can report repairs, track energy usage, get advice on cutting bills, and access plain-English guides on how their home works. Landlords get a single place to communicate with hundreds of tenants and reduce the back-and-forth.",
        image: '/images/projects/homehub.png',
        tags: ['Mobile', 'Flutter'],
        appStoreUrl: 'https://apps.apple.com/gb/app/homehub-info/id6752408814',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=uk.co.homehubinfo&hl=en',
    },
    {
        title: 'TaperedView',
        description:
            'An augmented reality tool that lets surveyors scan a flat roof with their phone or tablet and get accurate measurements instantly. It uses LiDAR to plot key points, then automatically converts the data into technical blueprints. Around ten times faster than measuring by hand and removes human error.',
        image: '/images/projects/taperedplus.png',
        tags: ['Mobile', 'AR', 'Swift'],
        appStoreUrl: undefined,
    },
    {
        title: 'COPA',
        description:
            'COPA is a mobile app that gives people across Teesside a way to report crime, antisocial behaviour and community concerns directly to Cleveland Police and the Police and Crime Commissioner. It was the first app of its kind in the UK, picked up over 7,500 downloads, and has contributed to successful prosecutions.',
        image: '/images/projects/copa.png',
        tags: ['Mobile', 'React Native', 'C#'],
        appStoreUrl: 'https://apps.apple.com/gb/app/copa/id1638356129',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.clevelandpcc.reporting&hl=en',
    },
    {
        title: 'Cwtsh',
        description:
            'Cwtsh is an internal rewards app built for Transport for Wales. Staff recognise each other by sending digital coins that can be redeemed for gift vouchers, and the app doubles as an internal news and social platform with gamification built in. Over 2,500 employees downloaded it in its first year.',
        image: '/images/projects/cwtsh.png',
        tags: ['Mobile', 'React Native', 'C#'],
        appStoreUrl: undefined,
        playStoreUrl: undefined,
    },
];

/** Featured project titles for the home slider, in display order. */
const FEATURED_SLIDER_TITLES = ['COPA', 'TaperedView', 'Roger That', 'HomeHub'] as const;

/** Projects for the home page slider (featured order). Projects page still uses `projects` (most recent first). */
export const featuredProjects: Project[] = FEATURED_SLIDER_TITLES.map(
    (title) => projects.find((p) => p.title === title)!,
).filter(Boolean);

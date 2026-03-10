export type Thought = {
    slug: string;
    title: string;
    date: string;
    content: string[];
    tags?: string[];
};

export const THOUGHTS_INTRO =
    "Sometimes I write about things I'm thinking about. Some are quick thoughts, some turn into longer posts.";

export const thoughts: Thought[] = [
    {
        slug: 'teaching-sand-to-think',
        title: 'Teaching Sand to Think',
        date: 'March 2026',
        content: [
            "The universe doesn't know we're here and it likely won't notice when we're gone. And somewhere in that window we decided to spend our time teaching sand to think.",
        ],
        tags: ['AI', 'Reflections'],
    },
];

export const latestThoughts = thoughts.slice(0, 3);

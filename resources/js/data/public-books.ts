/**
 * Shape of each item in the globally shared `publicBooks` prop (public list only).
 */
export type PublicBookTerminal = {
    slug: string;
    title: string;
    author: string;
    rating: number;
    date_finished: string | null;
    image: string;
};

/**
 * Intro paragraph for the public /thoughts index (MaskedWords on page).
 */
export const THOUGHTS_INTRO =
    "Sometimes I write about things I'm thinking about. Some are quick thoughts, some turn into longer posts.";

/** Shape of a thought row on the public index and home “latest” strip. */
export type PublicThoughtListItem = {
    slug: string;
    title: string;
    date: string;
};

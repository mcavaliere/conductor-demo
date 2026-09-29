import { fn } from "storybook/test";

// Storybook mock for the admin server actions (registered via sb.mock in
// .storybook/preview.tsx) so stories never touch Clerk or the database.
export const createPost = fn().mockName("createPost");
export const updatePost = fn().mockName("updatePost");
export const deletePost = fn().mockName("deletePost");
export const deletePosts = fn<(ids: string[]) => Promise<void>>().mockName("deletePosts");
export const publishPost = fn().mockName("publishPost");
export const unpublishPost = fn().mockName("unpublishPost");

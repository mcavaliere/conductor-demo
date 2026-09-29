/**
 * Data-access module for blog posts.
 *
 * Backed by an in-memory seed array for now. Prisma/Postgres is being added
 * concurrently in a separate track — this module's exported shape (`Post`)
 * and function signature (`getPublishedPosts`) are meant to be a drop-in
 * swap for a real Prisma-backed implementation later.
 */

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

const posts: Post[] = [
  {
    id: "1",
    slug: "welcome-to-the-blog",
    title: "Welcome to the Blog",
    excerpt: "A quick hello, and what to expect from this space.",
    content:
      "<p>Welcome! This is the first post on our new blog. We'll be sharing " +
      "updates, tutorials, and behind-the-scenes notes here.</p>",
    published: true,
    authorId: "author_1",
    createdAt: new Date("2026-01-05T09:00:00.000Z"),
    updatedAt: new Date("2026-01-05T09:00:00.000Z"),
  },
  {
    id: "2",
    slug: "building-with-nextjs",
    title: "Building with Next.js",
    excerpt: "Notes on building this site with the App Router.",
    content:
      "<p>We chose Next.js for its file-based routing, server components, " +
      "and built-in support for metadata routes like sitemaps and feeds.</p>",
    published: true,
    authorId: "author_1",
    createdAt: new Date("2026-02-12T14:30:00.000Z"),
    updatedAt: new Date("2026-02-14T10:15:00.000Z"),
  },
  {
    id: "3",
    slug: "a-draft-in-progress",
    title: "A Draft in Progress",
    excerpt: "This one isn't ready yet.",
    content: "<p>Still writing this one — check back later.</p>",
    published: false,
    authorId: "author_2",
    createdAt: new Date("2026-03-01T08:00:00.000Z"),
    updatedAt: new Date("2026-03-01T08:00:00.000Z"),
  },
  {
    id: "4",
    slug: "shipping-an-rss-feed",
    title: "Shipping an RSS Feed",
    excerpt: "Why we added a feed and sitemap to the blog.",
    content:
      "<p>RSS feeds and sitemaps make it easier for readers and search " +
      "engines to find and follow new posts, even without visiting the site.</p>",
    published: true,
    authorId: "author_2",
    createdAt: new Date("2026-03-20T11:45:00.000Z"),
    updatedAt: new Date("2026-03-20T11:45:00.000Z"),
  },
];

/** Published posts, newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
  return posts
    .filter((post) => post.published)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/** A single published post by slug, or null. Unpublished/draft posts return null. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = posts.find((post) => post.slug === slug && post.published);
  return post ?? null;
}

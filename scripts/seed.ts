import { db } from "../src/prisma/db";
import { slugify } from "../lib/slug";

// One published post and one draft, so the public/admin split is visible
// immediately. Idempotent: upserts by slug.
const AUTHOR = "seed-script";

const posts = [
  {
    title: "Welcome to the CMS",
    excerpt: "The first published post, rendered on the public blog.",
    body: "<h2>Hello</h2><p>This post is <strong>published</strong> and visible at <code>/blog</code>.</p><ul><li>Rich text</li><li>Sanitized HTML</li></ul>",
    status: "published" as const,
  },
  {
    title: "A work in progress",
    excerpt: "This draft should never appear on the public blog.",
    body: "<p>Still writing this one…</p>",
    status: "draft" as const,
  },
];

for (const p of posts) {
  const slug = slugify(p.title);
  const existing = await db.orm.public.Post.select("id").where({ slug }).first();

  if (existing) {
    await db.orm.public.Post.where({ id: existing.id }).update({
      title: p.title,
      excerpt: p.excerpt,
      body: p.body,
      status: p.status,
      publishedAt: p.status === "published" ? new Date().toISOString() : null,
    });
  } else {
    await db.orm.public.Post.create({
      title: p.title,
      slug,
      excerpt: p.excerpt,
      body: p.body,
      status: p.status,
      authorId: AUTHOR,
      publishedAt: p.status === "published" ? new Date().toISOString() : null,
    });
  }
  console.log(`seeded: ${slug} (${p.status})`);
}

await db.close();

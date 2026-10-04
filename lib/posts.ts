import type { Post } from "@prisma/client";
import { db } from "@/src/prisma/db";

export type { Post };

/** Published posts, newest first. Used by the public blog index. */
export async function getPublishedPosts(): Promise<Post[]> {
  return db.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
}

/** A single published post by slug, or null. Drafts return null. */
export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  return db.post.findFirst({ where: { slug, status: "published" } });
}

/** Every post (any status), newest first. Used by the admin dashboard. */
export async function getAllPosts(): Promise<Post[]> {
  return db.post.findMany({ orderBy: { createdAt: "desc" } });
}

/** A single post by id, or null. Used by the admin editor. */
export async function getPostById(id: string): Promise<Post | null> {
  return db.post.findUnique({ where: { id } });
}
